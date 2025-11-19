import { useMutation as useReactQueryMutation } from "@tanstack/react-query";
import { useMutation as useConvexMutation } from "convex/react";

import { api } from "../../../../../convex/_generated/api";

export const useUpdateUser = () => {
  const mutation = useConvexMutation(api.users.updateUser);

  const updateUser  = useReactQueryMutation({
    mutationFn: mutation,
  });

  return updateUser;
};
