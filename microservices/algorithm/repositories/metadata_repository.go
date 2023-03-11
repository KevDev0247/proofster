package repositories

import (
	"errors"
	"proofster/algorithm/models"
	"github.com/kamva/mgm/v3"
	"go.mongodb.org/mongo-driver/bson"
	db "proofster/algorithm/models/db"
)

func GetMetadataByWorkspace(
	workspaceId string,
) (*db.MetaData, error) {
	metadata := &db.MetaData{}

	err := mgm.Coll(metadata).First(
		bson.M{metadata.WorkspaceId: workspaceId}, 
		metadata,
	)
	if err != nil {
		return nil, errors.New("cannot find metadata")
	}
	return metadata, nil	
}

func CreateMetadata(request *models.MetadataRequest) (*db.MetaData, error) {
	metadata := db.NewMetaData(
		request.WorkspaceId,
		*request.ArgumentTranspiled,
		*request.CompletedStage,
		*request.AllNormalized,
		*request.IsPreprocessed,
	)

	err := mgm.Coll(metadata).Create(metadata)
	if err != nil {
		return nil, errors.New("cannot create new note")
	}
	return metadata, nil
}

func UpdateNote(request *models.MetadataRequest) error {
	metadata := &db.MetaData{}
	err := mgm.Coll(metadata).First(
		bson.M{metadata.WorkspaceId: request.WorkspaceId}, 
		metadata,
	)
	if err != nil {
		return errors.New("cannot find metadata")
	}

	if request.ArgumentTranspiled != nil {
		metadata.ArgumentTranspiled = *request.ArgumentTranspiled
	}
	if request.CompletedStage != nil {
		metadata.CompletedStage = *request.CompletedStage
	}
	if request.AllNormalized != nil {
		metadata.AllNormalized = *request.AllNormalized
	}
	if request.IsPreprocessed != nil {
		metadata.IsPreprocessed = *request.IsPreprocessed
	}
	err = mgm.Coll(metadata).Update(metadata)
	if err != nil {
		return errors.New("cannot update")
	}
	
	return nil
}
