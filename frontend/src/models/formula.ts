export interface IFormula {
    formula_id: number;
    name: string;
    formula_raw: string;
    formula_result: string;
    is_conclusion: boolean;
    workspace_id: string;
}