import {
  QueryFunction,
  QueryFunctionContext,
  QueryKey,
} from "@tanstack/react-query";
import { Attempt } from "../types/Attempt";
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
