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
			"stage": stage,
		},
	)
	if err != nil {
		return nil, errors.New("cannot find notes")
	}

	return steps, nil
}

func SaveBulkSteps(
	workspaceId string,
	stage int,
	steps []db.Step,
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

	toInsert := make([]interface{}, len(steps))
	for i := range steps {
		toInsert[i] = steps[i]
	}

	_, err = mgm.Coll(&db.Step{}).InsertMany(context.Background(), toInsert)
	if err != nil {
		return errors.New("cannot save formulas")
	}

	return nil
}
