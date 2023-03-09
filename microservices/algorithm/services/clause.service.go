package services

import (
	"context"
	"errors"
	"log"
	db "proofster/algorithm/models/db"
	"proofster/algorithm/utils"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetClauses(
	workspaceId string,
	algorithm int,
) ([]db.StepReturn, error) {
	var clauses []db.StepReturnItem
	options := options.Find().SetSort(bson.M{"stage": 1})

	coll := mgm.Coll(&db.Clause{})
	cursor, err := coll.Find(mgm.Ctx(), bson.M{
		"workspace_id": workspaceId,
		"algorithm":    algorithm,
		"stage":        bson.M{"$ne": 0},
	}, options)

	if err != nil {
		return nil, errors.New("cannot find notes")
	}
	err = cursor.All(mgm.Ctx(), &clauses)
	if err != nil {
		return nil, errors.New("cannot find notes")
	}

	groupedClauses := []db.StepReturn{}
	if len(clauses) != 0 {
		groupedClauses = append(groupedClauses, db.StepReturn{
			Steps: clauses,
			Description: utils.CreateStageDescription(8),
			StageName: utils.CreateStageName(8),
		})		
	}
	
	return groupedClauses, nil
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
