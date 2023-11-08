import {
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
} from "@tanstack/react-query";
import { AttemptResponse, PostAttempt } from "../types/Attempt";
import { baseInstance } from "./apiInstance";
import { CollabResponse } from "../types/Collab";

export const getHistory: QueryFunction<AttemptResponse[]> = async ({
  queryKey,
}: QueryFunctionContext<QueryKey, string>) => {
  const [, userId] = queryKey;

  const data = await baseInstance.get<AttemptResponse[]>("/history/attempt", {
    params: { userId },
  });
  return data.data;
};

export const postAttempt = async (attempt: PostAttempt) => {
  const data = await baseInstance.post("history/attempt", attempt);
  return data.data;
};

export const getCollabs: QueryFunction<CollabResponse[]> = async ({
  queryKey,
}: QueryFunctionContext<QueryKey, string>) => {
  const [, userId] = queryKey;

  const data = await baseInstance.get<CollabResponse[]>(
    "/history/collaboration",
    {
      params: { userId },
    },
  );
  return data.data;
};
