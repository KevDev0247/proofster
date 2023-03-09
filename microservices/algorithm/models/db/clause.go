package models

import (
	"github.com/kamva/mgm/v3"
)

type Clause struct {
	mgm.DefaultModel `bson:",inline"`
	FormulaId        string      `bson:"formula_id" json:"formula_id"`
	WorkspaceId      string      `bson:"workspace_id" json:"workspace_id"`
	IsConclusion     bool        `bson:"is_conclusion" json:"is_conclusion"`
	FormulaJson      interface{} `bson:"formula_json" json:"formula_json"`
	FormulaResult    string      `bson:"formula_result" json:"formula_result"`
	Stage            int         `bson:"stage" json:"stage"`
	Algorithm        int         `bson:"algorithm" json:"algorithm"`
	Description      string      `bson:"description" json:"description"`
	StageName        string      `bson:"stage_name" json:"stage_name"`
}

func NewClause(
	formulaId string,
	workspaceId string,
	isConclusion bool,
	formulaResult string,
	formulaJson interface{},
	stage int,
	algorithm int,
	description string,
	stageName string,
) *Clause {
	return &Clause{
		FormulaId:     formulaId,
		WorkspaceId:   workspaceId,
		IsConclusion:  isConclusion,
		FormulaJson:   formulaJson,
		FormulaResult: formulaResult,
		Stage:         stage,
		Algorithm:     algorithm,
		Description:   description,
		StageName:     stageName,
	}
}
