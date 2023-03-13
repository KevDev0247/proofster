package repositories

import (
	"context"
	"errors"
	"log"
	db "proofster/algorithm/models/db"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// error handling, specify errors
func GetPreprocessed(
    workspaceId string,
) ([]db.StepReturnItem, error) {
    steps := []db.StepReturnItem{}

    options := options.Find().SetSort(bson.M{"stage": 1})
    coll := mgm.Coll(&db.Preprocessed{})
    cursor, err := coll.Find(mgm.Ctx(), bson.M{
        "workspace_id": workspaceId,
        "stage": bson.M{
            "$ne": 0,
        },
    }, options)

    if err != nil {
        return nil, errors.New("cannot find notes")
    }
    err = cursor.All(mgm.Ctx(), &steps)
    if err != nil {
        return nil, errors.New("cannot find notes")
    }

    return steps, nil
}

func GetNormalized(
	workspaceId string,
) ([]db.StepReturnItem, error) {
	steps := []db.StepReturnItem{}

	options := options.Find().SetSort(bson.M{"stage": 1})
	coll := mgm.Coll(&db.Normalized{})
	cursor, err := coll.Find(mgm.Ctx(), bson.M{
		"workspace_id": workspaceId,
		"stage": bson.M{
			"$ne": 0,
		},
	}, options)

	if err != nil {
		return nil, errors.New("cannot find notes")
	}
	err = cursor.All(mgm.Ctx(), &steps)
	if err != nil {
		return nil, errors.New("cannot find notes")
	}

    return steps, nil
}

func GetStepsByStageAndAlgorithm(
	workspaceId string,
	stage int,
	algorithm int,
) ([]db.Normalized, error) {
	steps := []db.Normalized{}

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

// todo: refactor into repository
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
			return errors.New("cannot save formulas")
		}
	}

	return nil
}
