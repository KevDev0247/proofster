package services

import (
	"log"
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	db "proofster/algorithm/models/db"
	// "proofster/algorithm/utils"
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

	log.Printf("%v", result)

	resultChan <- map[string]interface{}{
		"data": result,
	}
}

func Normalize(
	stage int,
	workspaceId string,
	algorithm int,
) error {
	// stepOneJsonKey := utils.CreateStepOneKey(stage, "json")
	// stepTwoJsonKey := utils.CreateStepTwoKey(stage, "json")
	// stepThreeJsonKey := utils.CreateStepThreeKey(stage, "json")
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
	if algorithm == 1 {
		isProof = true
	}
	if len(conclusion) == 0 && isProof {
		return errors.New("no conclusion was provided for proof preprocessing")
	}	

	log.Printf("%v", 3)

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

	// resultMap := <-resultChan
	// log.Printf("%v", resultMap["data"])

	// result := resultMap["data"].(map[string]interface{})
	
	// errMsg := <-errChan
	// if errMsg != nil {
	// 	return errors.New("error occurred during normalization")
	// }

	// ids := []string{}
	// conclusionId := ""
	// for _, step := range argument {
	// 	ids = append(ids, step.FormulaId)

	// 	if result["is_conclusion"].(bool) {
	// 		conclusionId = result["formula_id"].(string)
	// 	}
	// }

	// stepOneJsons := result[stepOneJsonKey].([]map[string]interface{})
	// stepOneStrings := result[stepOneStringKey].([]string)
	// log.Printf("%v", stepOneJsons)
	// err = SaveBulkSteps(
	// 	ids,
	// 	stepOneStrings,
	// 	stepOneJsons,
	// 	conclusionId,
	// 	workspaceId,
	// 	stage+1,
	// 	algorithm,
	// 	"",
	// )
	// if err != nil {
	// 	return errors.New("error occurred during step one saving")
	// }

	// stepTwoJsons := result[stepTwoJsonKey].([]map[string]interface{})
	// stepTwoStrings := result[stepTwoStringKey].([]string)
	// log.Printf("%v", stepTwoJsons)
	// err = SaveBulkSteps(
	// 	ids,
	// 	stepTwoStrings,
	// 	stepTwoJsons,
	// 	conclusionId,
	// 	workspaceId,
	// 	stage+2,
	// 	algorithm,
	// 	"",
	// )
	// if err != nil {
	// 	return errors.New("error occurred during step two saving")
	// }

	// stepThreeJsons := result[stepThreeJsonKey].([]map[string]interface{})
	// stepThreeStrings := result[stepThreeStringKey].([]string)
	// log.Printf("%v", stepThreeJsons)
	// err = SaveBulkSteps(
	// 	ids,
	// 	stepThreeStrings,
	// 	stepThreeJsons,
	// 	conclusionId,
	// 	workspaceId,
	// 	stage+3,
	// 	algorithm,
	// 	"",
	// )
	// if err != nil {
	// 	return errors.New("error occurred during step three saving")
	// }

	return nil
}
