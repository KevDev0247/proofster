package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	db "proofster/algorithm/models/db"
	"sync"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
)

func CallTranspiler(
	formula *db.Formula,
	resultChan chan<- map[string]interface{},
	wg *sync.WaitGroup,
) {
	defer wg.Done()

	payload, err := json.Marshal(map[string]string{
		"formula_infix": formula.FormulaInfix,
	})
	if err != nil {
		resultChan <- map[string]interface{}{
			"formula_id": formula.FormulaId,
			"error":      err.Error(),
		}
		return
	}

	resp, err := http.Post(
		Config.TranspilerUrl,
		"application/json",
		bytes.NewBuffer(payload),
	)
	if err != nil {
		resultChan <- map[string]interface{}{
			"formula_id": formula.FormulaId,
			"error":      err.Error(),
		}
		return
	}
	defer resp.Body.Close()

	var responseMap map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&responseMap); err != nil {
		resultChan <- map[string]interface{}{
			"formula_id": formula.FormulaId,
			"error":      err.Error(),
		}
		return
	}

	resultChan <- map[string]interface{}{
		"formula_id":      formula.FormulaId,
		"is_conclusion":   formula.IsConclusion,
		"formula_json":    responseMap["formula_json"],
		"formula_postfix": responseMap["formula_postfix"],
		"formula_result":  responseMap["formula_result"],
	}
}

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
		go CallTranspiler(formula, resultChan, &wg)
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

	SaveBulkSteps(
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

	SaveBulkSteps(
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

	return nil
}
