package models

import (
	"github.com/kamva/mgm/v3"
)

type MetaData struct {
	mgm.DefaultModel   `bson:",inline"`
	WorkspaceId        string `json:"workspace_id"`
	ArgumentTranspiled bool      `json:"argument_saved"`
	CompletedStage     int       `json:"completed_stage"`
	AllNormalized      bool      `json:"all_normalized"`
	IsPreprocessed     bool      `json:"is_preprocessed"`
}

func NewMetaData(
	workspaceId string,
	argumentSaved bool,
	completedStage int,
	allNormalized bool,
	isPreprocessed bool,
) *MetaData {
	return &MetaData{
		WorkspaceId:        workspaceId,
		ArgumentTranspiled: argumentSaved,
		CompletedStage:     completedStage,
		AllNormalized:      allNormalized,
		IsPreprocessed:     isPreprocessed,
	}
}
