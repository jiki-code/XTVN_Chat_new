"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input"
import { useUpdateUser } from "../components/api/use-update-user";
import { Loader } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
export interface UserProfile {
  _id: Id<"users">;
  name?: string;
  email?: string;
  image?: string;
  userStatus?: string;
  _creationTime?: number
}

export interface UserProfileModalProps {
  user: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loading?: boolean;

}

export function UserProfileModal({
  user,
  open,
  onOpenChange,
  loading,

}: UserProfileModalProps) {

  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateUser = useUpdateUser()
  const [images, setImages] = useState('');

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > ( 2 * 1024 * 1024)) { // 1 MB
        toast.warning("Please choose a small size image");
        return
    }

    try {
      const base64 = await fileToBase64(file);
      setImages(base64);       // store base64 in state
    } catch (error) {
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;

      reader.readAsDataURL(file); // Convert to base64
    });
  };

  const onEdit = async () => {
    if (!images || !user) return;

    const payload = {
      image: images,
      userId: user._id,
    };
    await updateUser.mutateAsync(payload).then(() => {
      onClose()
      toast.success("Update profile successfully");

    })
      .catch((error) => {
        console.error(error);
      });
  }
  function onClose() {
    setImages('')
    onOpenChange(false)
  }
  if (!user) {
    return <Loader className="size-5 animate-spin text-muted-foreground" />;
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>

      <DialogContent className="max-w-[450px] p-2 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 text-left">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20 rounded-full ring-1 ring-border" onClick={handleAvatarClick}>
              {loading ? (
                <div className="h-full w-full animate-pulse rounded-2xl bg-muted" />
              ) : (
                <>
                  <AvatarImage src={images ? images : user?.image} alt={user?.name ?? ""} />
                  <AvatarFallback className="text-lg">
                    {user?.name}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex-1 min-w-0">

              <DialogDescription asChild>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
                  <div className="flex">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="w-24 text-right">
                          Username
                        </label>
                        <Input value={user.name} placeholder="Nhập username" className="flex-1" />
                      </div>

                      <div className="flex items-center gap-3">
                        <label htmlFor="email" className="w-24 text-right">
                          Email
                        </label>
                        <Input value={user.email} type="email" placeholder="Nhập email" className="flex-1" />
                      </div>
                      <div className="flex items-center gap-3">
                        <label htmlFor="email" className="w-24 text-right">
                          Create At
                        </label>
                        <Input value={user._creationTime ? new Date(user._creationTime).toLocaleDateString("vi-VN") : ''} type="email" placeholder="Nhập email" className="flex-1" />
                      </div>

                    </div>
                  </div>
                </div>
              </DialogDescription>
            </div>

          </div>
        </DialogHeader>


        <DialogFooter className="px-6 py-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>

          <Button className="gap-2" onClick={onEdit}>
            Edit Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

