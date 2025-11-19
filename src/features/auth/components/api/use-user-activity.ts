import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface UseGetUserActivityProps {
  userId?: Id<"users"> | null; // allow missing while user is loading
}

export const useGetUserActivity = ({ userId }: UseGetUserActivityProps) => {
  const users = useQuery(
    api.users.getUserActivity,
    userId ? { userId } : "skip" // Convex: "skip" stops the query when no userId
  );

  const isLoading = userId != null && users === undefined;

  return {
    users,
    isLoading,
  };
};