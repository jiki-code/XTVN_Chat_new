import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";

export const useMarkMessageRead = () => {
  const convexMarkRead = useMutation(api.messages.markRead);
  const [isPending, setIsPending] = useState(false);

  const mutate = async (vars: { id: Id<"messages"> }) => {
    try {
      setIsPending(true);
      await convexMarkRead(vars);
    } finally {
      setIsPending(false);
    }
  };

  return { mutate, isPending };
};
