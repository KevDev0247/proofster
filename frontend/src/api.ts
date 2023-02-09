import axios from 'axios'

let baseUserURL = "http://localhost:8000/api/users/";
let baseWorkspaceURL = "http://localhost:8001/api/workspaces/";
let baseFormulaRL = "http://localhost:8002/api/formulas/";

export const USER_API = axios.create({
    baseURL: baseUserURL
});

export const WORKSPACE_API = axios.create({
    baseURL: baseWorkspaceURL
});

export const FORMULA_API = axios.create({
    baseURL: baseFormulaRL
});
