import { useMemberId } from "@/hooks/use-member-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { Loader } from "lucide-react";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { MessageList } from "@/components/message-list";
import { usePanel } from "@/hooks/use-panel";
import { useEffect } from "react";
import { useMarkAllAsRead } from "@/features/messages/api/use-mark-all-read";
interface ConversationProps {
  id: Id<"conversations">;
}

export const Conversations = ({ id }: ConversationProps) => {
  const memberId = useMemberId();
 
  const { onOpenProfile, onClose } = usePanel();

  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });
  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });
  const markAllAsRead = useMarkAllAsRead({ conversationId: id });
     useEffect(() => {
      if (id && !markAllAsRead.isPending) {
        markAllAsRead.mutate();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

  if (memberLoading || status === "LoadingFirstPage")
    return (
      <div className="h-full flex justify-center items-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={member?.user.name}
        memberImage={member?.user.image}
        onClick={() => {
          onOpenProfile(memberId);
        }}
      />
      <MessageList
        data={results}
        variant="conversation"
        memberImage={member?.user.image}
        memberName={member?.user.name}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
      />
      <ChatInput
        placeholder={`Message ${member?.user.name}`}
        conversationId={id}
      />
    </div>
  );
};
