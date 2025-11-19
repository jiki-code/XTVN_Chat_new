"use client";

import { UserButton } from "@/features/auth/components/user-button";
import  SidebarButton  from "../workspace/[workspaceId]/siderbar-button";
import Link from "next/link";
import { Bell, Home, Users } from "lucide-react";
export const SidebarTime = () => {

  return (
    <div className="w-[70px] h-full bg-[#3C0753] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
      <Link href={`/`}
        onClick={(e) => e.stopPropagation()}>

        <SidebarButton icon={Home} label="Home" />
      </Link>
      <Link
        href={`/times`}
        onClick={(e) => e.stopPropagation()}
      >
        <SidebarButton icon={Bell} label="Activity" />

      </Link>
      <Link
        href={`/config-user`}
        onClick={(e) => e.stopPropagation()}
      >
        <SidebarButton icon={Users} label="Users" />
      </Link>
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </div>
  );
};
