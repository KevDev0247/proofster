export interface IFormulaResult {
  is_conclusion: boolean,
  formula_result: string,
}

export interface INormalized {
  stage_name: string,
  steps: IFormulaResult[],
  description: string
}