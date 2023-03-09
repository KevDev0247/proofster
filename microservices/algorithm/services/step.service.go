package services

import (
	"context"
	"errors"
	"fmt"
	"log"
	db "proofster/algorithm/models/db"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
)

func GetStepByStageAndAlgorithm(
	workspaceId string,
	stage int,
	algorithm int,
) ([]db.Normalized, error) {
	var steps []db.Normalized

	if algorithm == 0 {
		err := mgm.Coll(&db.Normalized{}).SimpleFind(
			&steps,
			bson.M{
				"workspace_id": workspaceId,
				"stage":        stage,
				"algorithm":    algorithm,
			},
		)
		if err != nil {
			return nil, errors.New("cannot find notes")
		}
	} else {
		err := mgm.Coll(&db.Preprocessed{}).SimpleFind(
			&steps,
			bson.M{
				"workspace_id": workspaceId,
				"stage":        stage,
				"algorithm":    algorithm,
			},
		)
		if err != nil {
			return nil, errors.New("cannot find notes")
		}
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
	stageName string,
) error {
	if algorithm == 0 {
		_, err := mgm.Coll(&db.Normalized{}).DeleteMany(
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

		toInsert := make([]interface{}, 0)
		for i := range ids {
			step := db.NewNormalized(
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
			toInsert = append(toInsert, *step)
		}

		log.Printf("%v", toInsert)

		_, err = mgm.Coll(&db.Normalized{}).InsertMany(context.Background(), toInsert)
		if err != nil {
			fmt.Println("InsertMany error:", err)
			return errors.New("cannot save formulas")
		}
	} else {
		_, err := mgm.Coll(&db.Preprocessed{}).DeleteMany(
			context.Background(),
			bson.M{
				"workspace_id": workspaceId,
				"stage":        stage,
				"algorithm":    algorithm,
			},
		)
		if err != nil {
			return errors.New("cannot delete existing preprocessed results")
		}

		toInsert := make([]interface{}, 0)
		for i := range ids {
			step := db.NewPreprocessed(
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
			toInsert = append(toInsert, *step)
		}

		log.Printf("%v", toInsert)

		_, err = mgm.Coll(&db.Preprocessed{}).InsertMany(context.Background(), toInsert)
		if err != nil {
			fmt.Println("InsertMany error:", err)
			return errors.New("cannot save formulas")
		}
	}

	return nil
}
