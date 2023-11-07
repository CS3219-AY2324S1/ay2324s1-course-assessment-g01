import {
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
} from "@tanstack/react-query";
import { Attempt, PostAttempt } from "../types/Attempt";
import { baseInstance } from "./apiInstance";

export const getHistory: QueryFunction<Attempt[]> = async ({
  queryKey,
}: QueryFunctionContext<QueryKey, string>) => {
  const [, userId] = queryKey;

  const data = await baseInstance.get<Attempt[]>("/history/attempt", {
    params: { userId },
  });
  return data.data;
};

export const postAttempt = async (attempt : PostAttempt) => {
  const data = await baseInstance.post("history/attempt", attempt);
  return data.data;
};