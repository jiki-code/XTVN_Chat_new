"use client";
import { useQuery } from "convex/react";

import { api } from "../../../../../convex/_generated/api";

export const useUserList = () => {
  const data = useQuery(api.users.getList); 
  const isLoading = data === undefined;

  return {
    users: data ?? [],
    isLoading,
  };
};


