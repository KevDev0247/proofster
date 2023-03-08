package models

import (
	"encoding/json"

	"github.com/google/uuid"
	"github.com/kamva/mgm/v3"
)

type Step struct {
	mgm.DefaultModel `bson:",inline"`
	FormulaId        uuid.UUID       `bson:"formula_id" json:"formula_id"`
	WorkspaceId      uuid.UUID       `bson:"workspace_id" json:"workspace_id"`
	IsConclusion     bool            `bson:"is_conclusion" json:"is_conclusion"`
	FormulaJson      json.RawMessage `bson:"formula_json" json:"formula_json"`
	FormulaResult    string          `bson:"formula_result" json:"formula_result"`
	Stage            int             `bson:"stage" json:"stage"`
	Algorithm        int             `bson:"algorithm" json:"algorithm"`
	Description      string          `bson:"description" json:"description"`
}

func NewStep(
	formulaId uuid.UUID,
	workspaceId uuid.UUID,
	isConclusion bool,
	formulaResult string,
	formulaJson json.RawMessage,
	stage int,
	algorithm int,
	description string,
) *Step {
	return &Step{
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
