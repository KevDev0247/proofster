package services

import (
	"errors"
	db "proofster/algorithm/models/db"
	repositories "proofster/algorithm/repositories"
)

func GetMetadata() ([]db.Metadata, error) {
	metadatas, err := repositories.GetMetadata()
	if err != nil {
		return nil, errors.New(err.Error())
	}

	return metadatas, nil
}

func GetMetadataByWorkspace(
	workspaceId string,
) (*db.Metadata, error) {
	metadata, err := repositories.GetMetadataByWorkspace(workspaceId)
	if err != nil {
		return nil, errors.New(err.Error())
	}

	return metadata, nil
}
