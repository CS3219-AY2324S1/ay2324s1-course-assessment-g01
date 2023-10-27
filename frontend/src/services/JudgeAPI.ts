import { CodeSubmission } from "../types/Judge";
import { baseInstance } from "./apiInstance";

export const submitCode = async (submission : CodeSubmission) => {
    const data = await baseInstance.post("/judge/submissions", submission);
    return data.data;
};

export const getResult = async (token : string) => {
    const data = await baseInstance.get(`/judge/submissions${token}`);
    return data.data;
};