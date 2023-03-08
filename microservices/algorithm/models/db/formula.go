package models

import (
	"github.com/kamva/mgm/v3"
)

type Formula struct {
	mgm.DefaultModel `bson:",inline"`
	FormulaId    string       `bson:"formula_id" json:"formula_id"`
	WorkspaceId  string       `bson:"workspace_id" json:"workspace_id"`
	IsConclusion bool            `bson:"is_conclusion" json:"is_conclusion"`
	FormulaInfix string          `bson:"formula_infix" json:"formula_infix"`
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
