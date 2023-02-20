import { NORMALIZER_API } from "../../api";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface INormalizer {
    stage: number;
    workspace_id: string;
    is_proof: boolean
}

export const normalize = createAsyncThunk(
    "normalizer/nnf",
    async (normalizer: INormalizer) => {
        try {
            const response = await NORMALIZER_API.post("", normalizer);
            return response.data.results;
        } catch (error) {
            console.log(error);
        }
    }
)
