package services

import (
	"errors"
	db "proofster/algorithm/models/db"
	repositories "proofster/algorithm/repositories"
)

func GetMetadata(
	workspaceId string,
) (*db.Metadata, error) {
	metadata, err := repositories.GetMetadataByWorkspace(workspaceId)
	if err != nil {
		return nil, errors.New(err.Error())
	}

	return metadata, nil
}
