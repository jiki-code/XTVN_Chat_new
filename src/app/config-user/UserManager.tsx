"use client";
import { StatusSwitch } from "./components/switchStatus";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2, Loader, } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable"; // Reuse the DataTable created earlier
import { useUserList } from "@/features/auth/components/api/use-user-list";
import { useRemoveUser } from "@/features/auth/components/api/use-remove-user"
import { Id } from "../../../convex/_generated/dataModel";
import { useSwitchStatus } from "@/features/auth/components/api/use-switch-status";
import { toast } from "sonner";
import { useConfirm } from "@/hooks//use-confirm";

export type User = {
  id: Id<"users">;
  name?: string;
  email?: string;
  userStatus?: string;
  created_at: number;
};

export type UsersManagerProps = {
  className?: string;
};

export function UsersManager({ className = "" }: UsersManagerProps) {
const { users, isLoading } = useUserList();
  const switchStatus = useSwitchStatus();
  const removeUser = useRemoveUser();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "Do you want to delete this user?"
  );

  const handleSwitchStatus = (userID: string, isActive: boolean) => {
    const payload = {
      status: isActive ? 'active' : 'inactive', userId: userID as Id<"users">
    }
    switchStatus
      .mutateAsync(payload)
      .then(() => {
        toast.success("Status updated");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onDeleteUser = async (userID: string) => {
    const ok = await confirm();
    if (!ok) return;
    confirmDelete(userID)

  };

  const confirmDelete = (userID: string) => {
    const payload = {
      id: userID as Id<"users">
    }
    removeUser
      .mutateAsync(payload)
      .then(() => {
        toast.success("Remove user successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const columns = React.useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },

      {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => {
          const value = row.original.created_at;
          if (!value) return "—";
          const date = new Date(value);
          return date.toLocaleDateString("vi-VN");
        },
      },
      {
        accessorKey: "userStatus",
        header: "Status",
        cell: ({ row }) => {
          const value = row.original.userStatus;
          const userID = row.original.id;
          const isActive = value === 'active' ? true : false
          return (
            <StatusSwitch
              userId={userID}
              value={isActive}
              onChange={handleSwitchStatus}
              disabled={switchStatus.isPending}
            />
          );
        },

      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const user_id = row.original.id;
          return (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onDeleteUser(user_id)}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          );
        },
      },

    ],
    []
  );

  return (
    <div className={"space-y-4 " + className}>
      <ConfirmDialog />

      {isLoading ? <div className="flex justify-center items-end"><Loader className="size-5 animate-spin text-blue-500" /></div> : (<DataTable<User, unknown>
        columns={columns}
        data={users}
        label="Quản lý người dùng"

      />)}

    </div>
  );
}
