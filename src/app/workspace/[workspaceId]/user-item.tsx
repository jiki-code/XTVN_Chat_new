import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useEffect } from "react";

const UserItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#3C0753] bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  unreadCount?: number;
  variant?: VariantProps<typeof UserItemVariants>["variant"];
}
export const UserItem = ({
  id,
  label = "Member",
  image,
  variant,
  unreadCount = 0,
}: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label.charAt(0).toUpperCase();
  useEffect(() => {
    const audio = new Audio("/sounds/new-noti.mp3");
    if (unreadCount > 0) {
      setTimeout(() => {
        audio.play();
      }, 0)
    }
  }, [unreadCount])
  return (
    <Button
      variant="transparent"
      className={cn(UserItemVariants({ variant: variant }))}
      size="sm"
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <Avatar className="size-5 rounded-md mr-1">
          <AvatarImage className="rounded-md" src={image} />
          <AvatarFallback className="rounded-md">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm truncate">{label}</span>
        {unreadCount > 0 && (
          <span className="ml-auto bg-red-500 text-white text-xs font-semibold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shrink-0">
            {unreadCount > 30 ? "30+" : unreadCount}
          </span>
        )}
      </Link>
    </Button>
  );
};
