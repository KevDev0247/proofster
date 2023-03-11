package services

import (
	"errors"
	"proofster/algorithm/utils"
	"sort"
	db "proofster/algorithm/models/db"
	repositories "proofster/algorithm/repositories"
)

func BuildOrderedPreprocessed(
    workspaceId string,
) ([]db.StepReturn, error) {
	steps, err := repositories.GetPreprocessed(workspaceId)
    if err != nil {
        return nil, errors.New("cannot find notes")
    }

    stageMap := make(map[int][]db.StepReturnItem)
    for _, step := range steps {
        stageMap[step.Stage] = append(stageMap[step.Stage], step)
    }

    stageKeys := []int{}
    for k := range stageMap {
        stageKeys = append(stageKeys, k)
    }
    sort.Ints(stageKeys)

    groupedSteps := []db.StepReturn{}
    for _, stage := range stageKeys {
        group := stageMap[stage]
        groupedSteps = append(groupedSteps, db.StepReturn{
            Steps: group,
            Description: utils.CreateStageDescription(stage),
            StageName: utils.CreateStageName(stage),
        })
    }

    return groupedSteps, nil
}

func BuildOrderedNormalized(
	workspaceId string,
) ([]db.StepReturn, error) {
	steps, err := repositories.GetNormalized(workspaceId);
	if err != nil {
        return nil, errors.New("cannot find notes")
    }

    stageMap := make(map[int][]db.StepReturnItem)
    for _, step := range steps {
        stageMap[step.Stage] = append(stageMap[step.Stage], step)
    }

    stageKeys := []int{}
    for k := range stageMap {
        stageKeys = append(stageKeys, k)
    }
    sort.Ints(stageKeys)

    groupedSteps := []db.StepReturn{}
    for _, stage := range stageKeys {
        group := stageMap[stage]
		if group[0].FormulaResult == "" {
			group = make([]db.StepReturnItem, 0)
		}
        groupedSteps = append(groupedSteps, db.StepReturn{
            Steps: group,
            Description: utils.CreateStageDescription(stage),
            StageName: utils.CreateStageName(stage),
        })
    }

    return groupedSteps, nil
}

func BuildClauses(
	workspaceId string,
	algorithm int,
) ([]db.StepReturn, error) {
	clauses, err := repositories.GetClauses(workspaceId, algorithm)
	if err != nil {
		return nil, errors.New("cannot find notes")
	}

	groupedClauses := []db.StepReturn{}
	if len(clauses) != 0 {
		groupedClauses = append(groupedClauses, db.StepReturn{
			Steps: clauses,
			Description: utils.CreateStageDescription(9),
			StageName: utils.CreateStageName(9),
		})		
	}
	
	return groupedClauses, nil
}
