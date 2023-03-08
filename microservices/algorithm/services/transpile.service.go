package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	db "proofster/algorithm/models/db"
	"sync"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
)

func TranspileSingleFormula(
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
		go TranspileSingleFormula(formula, resultChan, &wg)
	}

	wg.Wait()
	close(resultChan)

	for result := range resultChan {
		log.Println(result)
	}

	return nil
}
