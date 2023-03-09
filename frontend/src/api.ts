import axios from "axios";

let baseUserURL = "http://localhost:8000/api/users/";
let baseWorkspaceURL = "http://localhost:8001/api/workspaces/";
let baseFormulaURL = "http://localhost:8002/api/formulas/";
let baseNormalizerURL = "http://localhost:8080/v1/normalize";

export const USER_API = axios.create({
  baseURL: baseUserURL,
});

export const WORKSPACE_API = axios.create({
  baseURL: baseWorkspaceURL,
});

export const FORMULA_API = axios.create({
  baseURL: baseFormulaURL,
});

export const NORMALIZER_API = axios.create({
  baseURL: baseNormalizerURL,
});
