import axios from "axios";

const debug = true;

let baseWorkspaceURL, baseFormulaURL, baseAlgorithmURL;

if (debug) {
  baseWorkspaceURL = process.env.REACT_APP_WORKSPACES_LOCAL + "/api/workspaces/";
  baseFormulaURL = process.env.REACT_APP_FORMULAS_LOCAL + "/api/formulas/";
  baseAlgorithmURL = process.env.REACT_APP_ALGORITHM_LOCAL + "/v1/normalize";
} else {
  baseWorkspaceURL = process.env.REACT_APP_WORKSPACES_SERVICE_ADDRESS + "/api/workspaces/";
  baseFormulaURL = process.env.REACT_APP_FORMULAS_SERVICE_ADDRESS + "/api/formulas/";
  baseAlgorithmURL = process.env.REACT_APP_ALGORITHM_SERVICE_ADDRESS + "/v1/normalize";
}

export const WORKSPACE_API = axios.create({
  baseURL: baseWorkspaceURL,
});

export const FORMULA_API = axios.create({
  baseURL: baseFormulaURL,
});

export const ALGORITHM_API = axios.create({
  baseURL: baseAlgorithmURL,
});
