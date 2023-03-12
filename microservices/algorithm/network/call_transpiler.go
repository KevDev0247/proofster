package network

import (
	"bytes"
	"encoding/json"
	"net/http"
	db "proofster/algorithm/models/db"
	"sync"
)

func CallTranspiler(
	transpilerUrl string,
	formula *db.Formula,
	resultChan chan<- map[string]interface{},
	wg *sync.WaitGroup,
) {
	defer wg.Done()

	payload, err := json.Marshal(map[string]string{
		"formula_input": formula.FormulaInput,
		"input_mode":    formula.InputMode,
	})
	if err != nil {
		resultChan <- map[string]interface{}{
			"formula_id": formula.FormulaId,
			"error":      err.Error(),
		}
		return
	}

	resp, err := http.Post(
		transpilerUrl,
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
