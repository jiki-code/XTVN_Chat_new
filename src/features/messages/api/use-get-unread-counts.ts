import { useQuery } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetUnreadCountsProps {
  workspaceId: Id<"workspaces">;
}

export const useGetUnreadCounts = ({
  workspaceId,
}: UseGetUnreadCountsProps) => {
  const data = useQuery(api.messages.getUnreadCounts, { workspaceId });

  return {
    data: data || { channels: {}, conversations: {} },
    isLoading: data === undefined,
  };
};
