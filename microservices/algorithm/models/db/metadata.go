package models

import (
	"github.com/kamva/mgm/v3"
)

type Metadata struct {
	mgm.DefaultModel `bson:",inline"`
	WorkspaceId      string `bson:"workspace_id" json:"workspace_id"`
	IsTranspiled     bool   `bson:"is_transpiled" json:"is_transpiled"`
	AllNormalized    bool   `bson:"all_normalized" json:"all_normalized"`
	IsPreprocessed   bool   `bson:"is_preprocessed" json:"is_preprocessed"`
}

func NewMetadata(
	workspaceId string,
	isTranspiled bool,
	allNormalized bool,
	isPreprocessed bool,
) *Metadata {
	return &Metadata{
		WorkspaceId:    workspaceId,
		IsTranspiled:   isTranspiled,
		AllNormalized:  allNormalized,
		IsPreprocessed: isPreprocessed,
	}
}
