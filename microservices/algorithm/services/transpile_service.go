package services

import (
	"errors"
	"proofster/algorithm/models"
	db "proofster/algorithm/models/db"
	network "proofster/algorithm/network"
	repositories "proofster/algorithm/repositories"
	"sync"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
)

func Transpile(
	workspaceId string,
) error {
	formulas := []*db.Formula{}
	err := mgm.Coll(&db.Formula{}).SimpleFind(
		&formulas,
		bson.M{"workspace_id": workspaceId},
	)
	if err != nil {
		return errors.New("error getting formulas")
	}
	var wg sync.WaitGroup
	resultChan := make(chan map[string]interface{}, len(formulas))

	for _, formula := range formulas {
		wg.Add(1)
		go network.CallTranspiler(
			Config.TranspilerUrl,
			formula,
			resultChan,
			&wg,
		)
	}

	wg.Wait()
	close(resultChan)

	ids := []string{}
	results := []string{}
	jsons := make([]map[string]interface{}, 0)
	conclusionId := ""
	for result := range resultChan {
		ids = append(ids, result["formula_id"].(string))
		results = append(results, result["formula_result"].(string))
		jsons = append(jsons, result["formula_json"].(map[string]interface{}))

		if result["is_conclusion"].(bool) {
			conclusionId = result["formula_id"].(string)
		}
	}

	err = repositories.SaveBulkSteps(
		ids,
		results,
		jsons,
		conclusionId,
		workspaceId,
		0,
		0,
		"Initial Step",
		"Initial",
	)
	if err != nil {
		return errors.New("error saving transpiled results for preprocessing")
	}
	err = repositories.SaveBulkSteps(
		ids,
		results,
		jsons,
		conclusionId,
		workspaceId,
		0,
		1,
		"Initial Step",
		"Initial",
	)
	if err != nil {
		return errors.New("error saving transpiled results for normalizing")
	}

	isTranspiled := true
	err = repositories.UpdateMetadata(&models.MetadataRequest{
		WorkspaceId: workspaceId,
		IsTranspiled: &isTranspiled,
	})
	if err != nil {
		return errors.New(err.Error())
	}	

	return nil
}
