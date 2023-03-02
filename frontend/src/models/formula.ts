export interface IFormula {
  id: number;
  name: string;
  formula_postfix: string;
  formula_infix: string;
  formula_result: string;
  is_conclusion: boolean;
  workspace_id: string;
  stage: number;
}
