import { api } from "../../../../../convex/_generated/api";
import { useMutation as useConvexMutation } from "convex/react";
import { useMutation as useReactQueryMutation } from "@tanstack/react-query";

export const useRecordActivity = () => {
  const mutation = useConvexMutation(api.users.recordActivity);

  const updateRecord  = useReactQueryMutation({
    mutationFn: mutation,
  });

  return updateRecord;
};