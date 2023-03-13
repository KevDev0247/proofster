package repositories

import (
	"context"
	"errors"
	"proofster/algorithm/models"
	db "proofster/algorithm/models/db"

	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
)

func GetMetadataByWorkspace(
	workspaceId string,
) (*db.MetaData, error) {
	metadata := &db.MetaData{}

	err := mgm.Coll(metadata).First(
		bson.M{
			"workspace_id": workspaceId,
		},
		metadata,
	)
	if err != nil {
		return nil, errors.New("cannot find metadata")
	}
	return metadata, nil
}

func SaveMetadata(
	workspaceId string,
	transpiled bool,
	allNormalized bool,
	isPreprocessed bool,
) error {
	metadata := &db.MetaData{}
	_, err := mgm.Coll(metadata).DeleteMany(
		context.Background(),
		bson.M{
			"workspace_id": workspaceId,
		},
	)
	if err != nil {
		return errors.New("cannot delete existing metadata")
	}

	metadata = db.NewMetaData(
		workspaceId,
		transpiled,
		allNormalized,
		isPreprocessed,
	)
	err = mgm.Coll(metadata).Create(metadata)
	if err != nil {
		return errors.New("cannot create new metadata")
	}

	return nil
}

func UpdateMetadata(request *models.MetadataRequest) error {
	metadata := &db.MetaData{}
	err := mgm.Coll(metadata).First(
		bson.M{"workspace_id": request.WorkspaceId},
		metadata,
	)
	if err != nil {
		return errors.New("cannot find metadata")
	}

	if request.IsTranspiled != nil {
		metadata.IsTranspiled = *request.IsTranspiled
	}
	if request.AllNormalized != nil {
		metadata.AllNormalized = *request.AllNormalized
	}
	if request.IsPreprocessed != nil {
		metadata.IsPreprocessed = *request.IsPreprocessed
	}
	err = mgm.Coll(metadata).Update(metadata)
	if err != nil {
		return errors.New(err.Error())
	}

	return nil
}
