import { UserButton } from "@/features/auth/components/user-button";
import React from "react";
import WorkspaceSwitcher from "./workspace-switcher";
import SidebarButton from "./siderbar-button";
import { Bell, Home, Users  } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-[70px] h-full bg-[#3C0753] flex flex-col gap-y-4 items-center pb-4">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathname.includes("/workspace")}
      />
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
        <SidebarButton icon={Users } label="Users" />
      </Link>
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};

export default Sidebar;
