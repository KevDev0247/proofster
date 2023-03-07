package models

import (
	"github.com/kamva/mgm/v3"
)

type Formula struct {
	mgm.DefaultModel `bson:",inline"`
	FormulaId    string       `json:"formula_id"`
	WorkspaceId  string       `json:"workspace_id"`
	IsConclusion bool            `json:"is_conclusion"`
	FormulaInfix string          `json:"formula_infix"`
}

func NewFormula(
	formulaId string,
	workspaceId string,
	isConclusion bool,
	formulaInfix string,
) *Formula {
	return &Formula{
		FormulaId: formulaId,
		WorkspaceId: workspaceId,
		IsConclusion: isConclusion,
		FormulaInfix: formulaInfix,
	}
}
