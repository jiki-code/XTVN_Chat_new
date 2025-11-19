import { useMutation as useReactQueryMutation } from "@tanstack/react-query";
import { useMutation as useConvexMutation } from "convex/react";

import { api } from "../../../../../convex/_generated/api";

export const useSwitchStatus = () => {
  const mutation = useConvexMutation(api.users.updatedStatus);

  const switchStatus  = useReactQueryMutation({
    mutationFn: mutation,
  });

  return switchStatus;
};
