package models

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/kamva/mgm/v3"
)

type Normalized struct {
	mgm.DefaultModel `bson:",inline"`
	FormulaId        uuid.UUID       `json:"formula_id"`
	WorkspaceId      uuid.UUID       `json:"workspace_id"`
	IsConclusion     bool            `json:"is_conclusion"`
	FormulaJson      json.RawMessage `json:"formula_json"`
	FormulaResult    string          `json:"formula_result"`
	Stage            int             `json:"stage"`
	Algorithm        int             `json:"algorithm"`
	Description      string          `json:"description"`
}

func NewNormalized(
	formulaId uuid.UUID,
	workspaceId uuid.UUID,
	isConclusion bool,
	formulaResult string,
	formulaJson json.RawMessage,
	stage int,
	algorithm int,
	description string,
) *Normalized {
	return &Normalized{
		FormulaId:     formulaId,
		WorkspaceId:   workspaceId,
		IsConclusion:  isConclusion,
		FormulaJson:   formulaJson,
		FormulaResult: formulaResult,
		Stage:         stage,
		Algorithm:     algorithm,
		Description:   description,
	}
}
