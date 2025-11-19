"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useCurrentUser } from "./api/use-current-user";
import { Loader, LogOut, LogOutIcon, UserRoundCog } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { UserProfileModal } from "./profile-user";

export const UserButton = () => {
  const { signOut } = useAuthActions();
  const { data, isLoading } = useCurrentUser();
   const [open, setOpen] = useState(false);
  const editProfile = () => {
    setOpen(true)
  }
  if (isLoading) {
    return <Loader className="size-5 animate-spin text-muted-foreground" />;
  }
  if (!data) {
    return null;
  }

  const { image, name, email, _id , _creationTime
 } = data;
  const avatarFallback = name!.charAt(0).toUpperCase();
  return (
     <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger className="outline-none relative">
          <Avatar className="rounded-md size-10 hover:opacity-75 transition">
            <AvatarImage
              className="rounded-md"
              alt={data.name}
              src={data.image}
            />
            <AvatarFallback className="rounded-md bg-sky-500 text-white ">
              {data.name!.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="right" className="w-60">
          <DropdownMenuItem onClick={editProfile} className="h-10">
            <UserRoundCog className="size-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => signOut()} className="h-10">
            <LogOutIcon className="size-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserProfileModal open={open}
        onOpenChange={setOpen} user={data} />
    </>
  );
};
