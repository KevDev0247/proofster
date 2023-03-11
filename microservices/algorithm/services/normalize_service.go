package services

import (
	"errors"
	"log"
	"sync"
	db "proofster/algorithm/models/db"
	repositories "proofster/algorithm/repositories"
	network "proofster/algorithm/network"
	utils "proofster/algorithm/utils"
)

func Normalize(
	stage int,
	workspaceId string,
	algorithm int,
) error {
	stepOneJsonKey := utils.CreateStepOneKey(stage, "json")
	stepTwoJsonKey := utils.CreateStepTwoKey(stage, "json")
	stepThreeJsonKey := utils.CreateStepThreeKey(stage, "json")
	stepOneStringKey := utils.CreateStepOneKey(stage, "string")
	stepTwoStringKey := utils.CreateStepTwoKey(stage, "string")
	stepThreeStringKey := utils.CreateStepThreeKey(stage, "string")

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

	startSteps, err := repositories.GetStepsByStageAndAlgorithm(
		workspaceId,
		stage,
		algorithm,
	)
	if err != nil {
		return err
	}

	premises := make([]db.Normalized, 0)
	conclusion := make([]db.Normalized, 0)
	for _, step := range startSteps {
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

	resultChan := make(chan map[string]interface{}, 1)
	errChan := make(chan error)
	var wg sync.WaitGroup
	wg.Add(1)

	go network.CallAlgorithm(
		stage,
		algorithmUrl,
		map[string]interface{}{
			"is_proof":      isProof,
			"argument_json": argumentJson,
		},
		resultChan,
		errChan,
		&wg,
	)

	wg.Wait()
	close(resultChan)

	result := <-resultChan

	ids := []string{}
	conclusionId := ""
	for _, step := range argument {
		ids = append(ids, step.FormulaId)

		if step.IsConclusion {
			conclusionId = step.FormulaId
		}
	}
	log.Printf("%v", result)

	stage++
	stepOneJsons := make([]map[string]interface{}, len(ids))
	stepOneStrings := make([]string, len(ids))
	if result[stepOneJsonKey] != nil && result[stepOneStringKey] != nil {
		stepOneJsons = utils.ConvertToMapSlice(result[stepOneJsonKey].([]interface{}))
		stepOneStrings = utils.ConvertToStringSlice(result[stepOneStringKey].([]interface{}))
	}
	err = repositories.SaveBulkSteps(
		ids,
		stepOneStrings,
		stepOneJsons,
		conclusionId,
		workspaceId,
		stage,
		algorithm,
		utils.CreateStageDescription(stage),
		utils.CreateStageName(stage),
	)
	if err != nil {
		return errors.New("error occurred during step one saving")
	}

	stage++
	stepTwoJsons := utils.ConvertToMapSlice(result[stepTwoJsonKey].([]interface{}))
	stepTwoStrings := utils.ConvertToStringSlice(result[stepTwoStringKey].([]interface{}))
	err = repositories.SaveBulkSteps(
		ids,
		stepTwoStrings,
		stepTwoJsons,
		conclusionId,
		workspaceId,
		stage,
		algorithm,
		utils.CreateStageDescription(stage),
		utils.CreateStageName(stage),
	)
	if err != nil {
		return errors.New("error occurred during step two saving")
	}

	stage++
	if stage == 9 {
		stepThreeJsons := result[stepThreeJsonKey].([]interface{})
		stepThreeStrings := utils.ConvertToStringSlice(result[stepThreeStringKey].([]interface{}))
		err = repositories.SaveBulkClauses(
			ids,
			stepThreeStrings,
			stepThreeJsons,
			conclusionId,
			workspaceId,
			stage,
			algorithm,
			utils.CreateStageDescription(stage),
			utils.CreateStageName(stage),
		)
		if err != nil {
			return errors.New("error occurred during step three saving")
		}
	} else {
		stepThreeJsons := utils.ConvertToMapSlice(result[stepThreeJsonKey].([]interface{}))
		stepThreeStrings := utils.ConvertToStringSlice(result[stepThreeStringKey].([]interface{}))
		err = repositories.SaveBulkSteps(
			ids,
			stepThreeStrings,
			stepThreeJsons,
			conclusionId,
			workspaceId,
			stage,
			algorithm,
			utils.CreateStageDescription(stage),
			utils.CreateStageName(stage),
		)
		if err != nil {
			return errors.New("error occurred during step three saving")
		}
	}

	return nil
}
