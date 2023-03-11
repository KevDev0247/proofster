package models

import (
	"github.com/kamva/mgm/v3"
)

type Formula struct {
	mgm.DefaultModel `bson:",inline"`
	FormulaId        string `bson:"formula_id" json:"formula_id"`
	WorkspaceId      string `bson:"workspace_id" json:"workspace_id"`
	IsConclusion     bool   `bson:"is_conclusion" json:"is_conclusion"`
	FormulaInput     string `bson:"formula_input" json:"formula_input"`
	InputMode        string `bson:"input_mode" json:"input_mode"`
}

func NewFormula(
	formulaId string,
	workspaceId string,
	isConclusion bool,
	formulaInput string,
	inputMode string,
) *Formula {
	return &Formula{
		FormulaId:    formulaId,
		WorkspaceId:  workspaceId,
		IsConclusion: isConclusion,
		FormulaInput: formulaInput,
		InputMode:    inputMode,
	}
}
