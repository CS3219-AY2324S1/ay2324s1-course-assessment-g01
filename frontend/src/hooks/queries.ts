import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { User } from "../types/User";
import { getUserData } from "../services/UserAPI";
import { Attempt } from "../types/Attempt";
import { getHistory } from "../services/HistoryAPI";

export const useUserQuery = (options?: UseQueryOptions<User>) =>
  useQuery<User>({
    queryKey: ["user"],
    queryFn: getUserData,
    ...options,
  });

export const useAttemptsQuery = (
  userId?: number,
  options?: UseQueryOptions<Attempt[]>,
) =>
  useQuery<Attempt[]>({
    queryKey: ["attempts", userId],
    queryFn: getHistory,
    ...options,
    enabled: !!userId,
  });
