import axios from "axios";

let baseWorkspaceURL = process.env.REACT_APP_WORKSPACES_SERVICE_ADDRESS + "/api/workspaces/";
let baseFormulaURL = process.env.REACT_APP_FORMULAS_SERVICE_ADDRESS + "/api/formulas/";
let baseAlgorithmURL = process.env.REACT_APP_ALGORITHM_SERVICE_ADDRESS + "/v1/normalize";

export const WORKSPACE_API = axios.create({
  baseURL: baseWorkspaceURL,
});

export const FORMULA_API = axios.create({
  baseURL: baseFormulaURL,
});

export const ALGORITHM_API = axios.create({
  baseURL: baseAlgorithmURL,
});
