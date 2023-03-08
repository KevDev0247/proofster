package services

import (
	"context"
	"errors"
	db "proofster/algorithm/models/db"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
)

func SaveBulkNormalized(
	workspaceId string,
	stage int,
	steps []db.Step,
) error {
	existing := []*db.Step{}

	err := mgm.Coll(&db.Formula{}).SimpleFind(
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
		toInsert[i] = &steps[i]
	}

	_, err = mgm.Coll(&db.Step{}).InsertMany(context.Background(), toInsert)
	if err != nil {
		return errors.New("cannot save formulas")
	}

	return nil
}
