package models

import (
	"github.com/google/uuid"
	"github.com/kamva/mgm/v3"
)

type MetaData struct {
	mgm.DefaultModel `bson:",inline"`
	WorkspaceId      uuid.UUID `json:"workspace_id"`
	ArgumentSaved    bool      `json:"argument_saved"`
	CompletedStage   int       `json:"completed_stage"`
	AllNormalized    bool      `json:"all_normalized"`
	IsPreprocessed   bool      `json:"is_preprocessed"`
}

func NewMetaData(
	workspaceId uuid.UUID,
	argumentSaved bool,
	completedStage int,
	allNormalized bool,
	IsPreprocessed bool,
) *MetaData {
	return &MetaData{
		WorkspaceId:    workspaceId,
		ArgumentSaved:  argumentSaved,
		CompletedStage: completedStage,
		AllNormalized:  allNormalized,
		IsPreprocessed: IsPreprocessed,
	}
}
