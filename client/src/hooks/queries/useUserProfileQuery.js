// client/src/hooks/queries/useUserProfileQuery.js
"use client";

import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import fetchUserDetails from "@/utils/fetchUserDetails";
import { setUserDetails } from "@/store/userSlice";

export function useUserProfileQuery({
  enabled = true,
  syncToRedux = true,
  ...queryOptions
} = {}) {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: ["user-profile"],
    enabled,
    queryFn: async () => {
      const result = await fetchUserDetails();
      return result?.data ?? null;
    },
    staleTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      if (syncToRedux) {
        dispatch(setUserDetails(data ?? null));
      }
      if (typeof queryOptions?.onSuccess === "function") {
        queryOptions.onSuccess(data);
      }
    },
    onError: (error) => {
      if (syncToRedux) {
        dispatch(setUserDetails(null));
      }
      if (typeof queryOptions?.onError === "function") {
        queryOptions.onError(error);
      }
    },
  });
}