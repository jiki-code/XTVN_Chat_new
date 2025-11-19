import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

interface useGetDailySummaryProps {
  userId?: Id<"users"> | null; // allow missing while user is loading
}

export const useGetDailySummary = ({ userId }: useGetDailySummaryProps) => {
  const summary = useQuery(
    api.users.getDailySummary,
    userId ? { userId } : "skip" // Convex: "skip" stops the query when no userId
  );

  const isLoading = userId != null && summary === undefined;

  return {
    summary,
    isLoading,
  };
};