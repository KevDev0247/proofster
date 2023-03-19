package repositories

import (
	"context"
	"errors"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	db "proofster/algorithm/models/db"
)

func GetFormulaByWorkspace(workspaceId string) ([]db.Formula, error) {
	formulas := []db.Formula{}

	err := mgm.Coll(&db.Formula{}).SimpleFind(
		&formulas,
		bson.M{"workspace_id": workspaceId},
	)
	if err != nil {
		return nil, errors.New("cannot find formulas")
	}

	return formulas, nil
}

func SaveBulkFormulas(
	workspaceId string,
	formulas []db.Formula,
) error {
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

	if len(toInsert) != 0 {
		_, err = mgm.Coll(&db.Formula{}).InsertMany(context.Background(), toInsert)
		if err != nil {
			return errors.New("cannot save formulas")
		}		
	}

	return nil
}
