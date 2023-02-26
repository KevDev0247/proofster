export interface IFormulaResult {
  is_conclusion: boolean,
  formula_result: string,
}

export interface INormalized {
  stage: string,
  formulas: IFormulaResult[],
  description: string
}