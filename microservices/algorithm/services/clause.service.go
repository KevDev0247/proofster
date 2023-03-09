package services

import (
	"context"
	"errors"
	"log"
	db "proofster/algorithm/models/db"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
)

func GetClauseByStage(
	workspaceId string,
	algorithm int,
) ([]db.Clause, error) {
	var clauses []db.Clause

	err := mgm.Coll(&db.Clause{}).SimpleFind(
		&clauses,
		bson.M{
			"workspace_id": workspaceId,
			"algorithm":    algorithm,
		},
	)
	if err != nil {
		return nil, errors.New("cannot find notes")
	}

	return clauses, nil
}

func SaveBulkClauses(
	ids []string,
	results []string,
	jsons []interface{},
	conclusionId string,
	workspaceId string,
	stage int,
	algorithm int,
	description string,
	stageName string,
) error {
	existing := []*db.Clause{}

	err := mgm.Coll(&db.Clause{}).SimpleFind(
		&existing,
		bson.M{
			"workspace_id": workspaceId,
			"stage":        stage,
			"algorithm":    algorithm,
		},
	)
	if err != nil {
		return errors.New("cannot get normalized results")
	}

	if len(existing) != 0 {
		_, err := mgm.Coll(&db.Clause{}).DeleteMany(
			context.Background(),
			bson.M{
				"workspace_id": workspaceId,
				"stage":        stage,
				"algorithm":    algorithm,
			},
		)
		if err != nil {
			return errors.New("cannot delete existing normalized results")
		}
	}

	log.Printf("%v", ids)
	log.Printf("%v", jsons)

	toInsert := make([]interface{}, 0)
	for i := range ids {
		clause := db.NewClause(
			ids[i],
			workspaceId,
			ids[i] == conclusionId,
			results[i],
			jsons[i],
			stage,
			algorithm,
			description,
			stageName,
		)
		toInsert = append(toInsert, *clause)
	}

	log.Printf("%v", toInsert)

	_, err = mgm.Coll(&db.Clause{}).InsertMany(context.Background(), toInsert)
	if err != nil {
		return errors.New("cannot save formulas")
	}

	return nil
}
