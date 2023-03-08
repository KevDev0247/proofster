package services

import (
	"context"
	"errors"
	db "proofster/algorithm/models/db"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
)

func SaveBulkFormula(
	workspaceId string,
	formulas []db.Formula,
)(error) {
	existing := []*db.Formula{}
	
	err := mgm.Coll(&db.Formula{}).SimpleFind(
		&existing,
		bson.M{"workspace_id": workspaceId},
	)
	if err != nil {
		return errors.New("cannot get formulas")
	}

	if len(existing) != 0 {
		_, err := mgm.Coll(&db.Formula{}).DeleteMany(
			context.Background(),
			bson.M{"workspace_id": workspaceId},
		)
		if err != nil {
			return errors.New("cannot delete existing formulas")
		}
	}
	
	toInsert := make([]interface{}, len(formulas))
	for i := range formulas {
		toInsert[i] = &formulas[i]
	}

	_, err = mgm.Coll(&db.Formula{}).InsertMany(context.Background(), toInsert)
	if err != nil {
		return errors.New("cannot save formulas")
	}

	return nil
}
