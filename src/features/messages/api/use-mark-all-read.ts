import { useMutation as useReactQueryMutation } from "@tanstack/react-query";
import { useMutation as useConvexMutation } from "convex/react";

import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseMarkAllAsReadProps {
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
}

export const useMarkAllAsRead = ({
  channelId,
  conversationId,
}: UseMarkAllAsReadProps) => {
  const convexMutation = useConvexMutation(api.messages.markAllAsRead);

  const mutation = useReactQueryMutation({
    mutationFn: () =>
      convexMutation({
        channelId,
        conversationId,
      }),
  });

  return mutation;
};
