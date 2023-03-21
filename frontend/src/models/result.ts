export interface IFormulaResult {
  is_conclusion: boolean,
  formula_result: string,
}

export interface IResult {
  stage_name: string,
  steps: IFormulaResult[],
  description: string
}