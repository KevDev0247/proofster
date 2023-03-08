package services

import (
	"log"
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	db "proofster/algorithm/models/db"
	"sync"
)

func executeAlgorithm(
	stage int,
	body map[string]interface{},
	resultChan chan<- map[string]interface{},
	errChan chan<- error,
	wg *sync.WaitGroup,
) {
	defer wg.Done()

	algorithmUrl := ""
	switch stage {
	case 0:
		algorithmUrl = Config.NNFUrl
	case 3:
		algorithmUrl = Config.PNFUrl
	case 6:
		algorithmUrl = Config.CNFUrl
	default:
		algorithmUrl = ""
	}
	
	payload, err := json.Marshal(body)
	if err != nil {
		errChan <- err
		return
	}

	resp, err := http.Post(
		algorithmUrl,
		"application/json",
		bytes.NewBuffer(payload),
	)
	if err != nil {
		errChan <- err
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		errChan <- err
		return
	}

	resultChan <- map[string]interface{}{
		"data": result,
	}
}

func Normalize(
	stage int,
	workspaceId string,
	algorithm int,
) error {
	// stepOneJSONKey := utils.CreateStepOneKey(stage, "json")
	// stepTwoJSONKey := utils.CreateStepTwoKey(stage, "json")
	// stepThreeJSONKey := utils.CreateStepThreeKey(stage, "json")
	// stepOneStringKey := utils.CreateStepOneKey(stage, "string")
	// stepTwoStringKey := utils.CreateStepTwoKey(stage, "string")
	// stepThreeStringKey := utils.CreateStepThreeKey(stage, "string")

	initialSteps, err := GetStepByStage(workspaceId, 0)
	if err != nil {
		return err
	}

	premises := make([]db.Step, 0)
	conclusion := make([]db.Step, 0)
	for _, step := range initialSteps {
		if step.IsConclusion {
			conclusion = append(conclusion, step)
		} else {
			premises = append(premises, step)
		}
	}
	argument := append(premises, conclusion...)

	argumentJson := make([]interface{}, 0, len(argument))
	for _, initialStep := range argument {
		argumentJson = append(argumentJson, initialStep.FormulaJson)
	}

	isProof := false
	if algorithm == 9 {
		isProof = true
	}

	resultChan := make(chan map[string]interface{}, 1)
	errChan := make(chan error)	
	var wg sync.WaitGroup
	wg.Add(1)

	go executeAlgorithm(stage, map[string]interface{}{
		"is_proof":      isProof,
		"argument_json": argumentJson,
	}, resultChan, errChan, &wg)

	wg.Wait()
	close(resultChan)
	
	result := <-resultChan
	log.Printf("%v", result["data"])

	if len(conclusion) == 0 && isProof {
		return errors.New("no conclusion was provided for proof preprocessing")
	}

	ids := []string{}
	for _, formula := range argument {
		ids = append(ids, formula.FormulaId)
	}

	// var conclusionID string
	// if len(conclusion) == 0 {
	// 	conclusionID = ""
	// } else {
	// 	conclusionID = conclusion[0].FormulaId
	// }



	return nil
}
