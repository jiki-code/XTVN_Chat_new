import { useMutation as useReactQueryMutation } from "@tanstack/react-query";
import { useMutation as useConvexMutation } from "convex/react";

import { api } from "../../../../../convex/_generated/api";

export const useRemoveUser = () => {
  const mutation = useConvexMutation(api.users.removeUser);

  const removeUser = useReactQueryMutation({
    mutationFn: mutation,
  });

  return removeUser;
};
