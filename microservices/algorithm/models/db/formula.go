package models

import (
	"github.com/google/uuid"
	"github.com/kamva/mgm/v3"
)

type Formula struct {
	mgm.DefaultModel `bson:",inline"`
	FormulaId    uuid.UUID       `json:"formula_id"`
	WorkspaceId  uuid.UUID       `json:"workspace_id"`
	IsConclusion bool            `json:"is_conclusion"`
	FormulaInfix string          `json:"formula_infix"`
}

func NewFormula(
	formulaId uuid.UUID,
	workspaceId uuid.UUID,
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
