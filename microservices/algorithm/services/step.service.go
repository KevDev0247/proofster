package services

import (
	"context"
	"errors"
	db "proofster/algorithm/models/db"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
)

func GetStepByStage(
	workspaceId string,
	stage int,
) ([]db.Step, error) {
	var steps []db.Step

	err := mgm.Coll(&db.Step{}).SimpleFind(
		&steps,
		bson.M{
			"workspace_id": workspaceId,
			"stage":        stage,
		},
	)
	if err != nil {
		return nil, errors.New("cannot find notes")
	}

	return steps, nil
}

func SaveBulkSteps(
	ids []string,
	results []string,
	jsons []map[string]interface{},
	conclusionId string,
	workspaceId string,
	stage int,
	algorithm int,
	description string,
) error {
	existing := []*db.Step{}

	err := mgm.Coll(&db.Step{}).SimpleFind(
		&existing,
		bson.M{
			"workspace_id": workspaceId,
			"stage":        stage,
		},
	)
	if err != nil {
		return errors.New("cannot get normalized results")
	}

	if len(existing) != 0 {
		_, err := mgm.Coll(&db.Step{}).DeleteMany(
			context.Background(),
			bson.M{
				"workspace_id": workspaceId,
				"stage":        stage,
			},
		)
		if err != nil {
			return errors.New("cannot delete existing normalized results")
		}
	}

	toInsert := make([]interface{}, len(ids))
	for i := range ids {
		step := db.NewStep(
			ids[i],
			workspaceId,
			ids[i] == conclusionId,
			results[i],
			jsons[i],
			stage,
			0,
			description,
		)
		toInsert[i] = step
	}

	_, err = mgm.Coll(&db.Step{}).InsertMany(context.Background(), toInsert)
	if err != nil {
		return errors.New("cannot save formulas")
	}

	return nil
}
