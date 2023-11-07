import { UseQueryOptions, useQuery } from "@tanstack/react-query";
import { User } from "../types/User";
import { getOtherUserData, getUserData } from "../services/UserAPI";
import { Attempt } from "../types/Attempt";
import { getCollabs, getHistory } from "../services/HistoryAPI";
import { Collab } from "../types/Collab";

export const useUserQuery = (options?: UseQueryOptions<User>) =>
  useQuery<User>({
    queryKey: ["user"],
    queryFn: getUserData,
    ...options,
  });

export const useOtherUserQuery = (
  id: number,
  options?: UseQueryOptions<User>,
) =>
  useQuery<User>({
    queryKey: ["user", id],
    queryFn: () => getOtherUserData(id),
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

export const useCollabsQuery = (
  userId?: number,
  options?: UseQueryOptions<Collab[]>,
) =>
  useQuery<Collab[]>({
    queryKey: ["collabs", userId],
    queryFn: getCollabs,
    ...options,
    enabled: !!userId,
  });
