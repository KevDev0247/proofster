package models

import (
	"github.com/kamva/mgm/v3"
)

type Step struct {
	mgm.DefaultModel `bson:",inline"`
	FormulaId        string                 `bson:"formula_id" json:"formula_id"`
	WorkspaceId      string                 `bson:"workspace_id" json:"workspace_id"`
	IsConclusion     bool                   `bson:"is_conclusion" json:"is_conclusion"`
	FormulaJson      map[string]interface{} `bson:"formula_json" json:"formula_json"`
	FormulaResult    string                 `bson:"formula_result" json:"formula_result"`
	Stage            int                    `bson:"stage" json:"stage"`
	Algorithm        int                    `bson:"algorithm" json:"algorithm"`
	Description      string                 `bson:"description" json:"description"`
}

func NewStep(
	formulaId string,
	workspaceId string,
	isConclusion bool,
	formulaResult string,
	formulaJson map[string]interface{},
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
