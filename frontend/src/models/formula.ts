export interface IFormula {
  id: string;
  name: string;
  formula_postfix: string;
  formula_input: string;
  input_mode: string;
  formula_result: string;
  is_conclusion: boolean;
  workspace_id: string;
  stage: number;
}
