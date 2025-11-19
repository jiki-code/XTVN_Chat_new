"use client";

import { useEffect, useRef } from "react";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "../../convex/_generated/api";
import { useChannelId } from "./use-channel-id";
import { useMemberId } from "./use-member-id";
import { useWorkspaceId } from "./use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
type QuillOp = {
  insert: string | object;
};
export const useNotifications = () => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const memberId = useMemberId();
  const pathname = usePathname();
  const currentMember = useCurrentMember({ workspaceId });
  const lastMessageIdsRef = useRef<Set<string>>(new Set());
  const lastCheckTimeRef = useRef<number>(Date.now());
  const initializedRef = useRef<boolean>(false);
  
  const conversationQuery = useCreateOrGetConversation();
  
  const currentConversationId = memberId ? conversationQuery.data : undefined;

  // Get recent messages to detect new ones
  const recentMessages = useQuery(
    api.messages.getRecentMessages,
    workspaceId ? { workspaceId, limit: 50 } : "skip"
  );
  console.log("🚀 ~ useNotifications ~ recentMessages:", recentMessages)

  // Initialize - mark current time after first load to avoid showing old messages
  useEffect(() => {
    if (recentMessages && recentMessages.length > 0 && !initializedRef.current) {
      lastCheckTimeRef.current = Date.now();
      initializedRef.current = true;
    }
  }, [recentMessages]);

  // Get channels for better notification titles
  const channels = useQuery(
    api.channels.get,
    workspaceId ? { workspaceId } : "skip"
  );

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(console.error);
      }
    }
  }, []);

  // Listen for new messages and show notifications
  useEffect(() => {
    if (
      !workspaceId ||
      !currentMember.data ||
      !recentMessages ||
      recentMessages.length === 0 ||
      !("Notification" in window) ||
      Notification.permission !== "granted"
    ) {
      return;
    }

    const now = Date.now();
    const isViewingChannel = channelId && pathname.includes("/channel/");
    const isViewingConversation = memberId && pathname.includes("/member/");

    // Check for new unread messages
    for (const message of recentMessages) {
      if (!initializedRef.current) {
        continue;
      }
      
      if (message._creationTime < lastCheckTimeRef.current - 5000) {
        continue;
      }

      if (lastMessageIdsRef.current.has(message._id)) {
        continue;
      }

      if (message.memberId === currentMember.data._id) {
        lastMessageIdsRef.current.add(message._id);
        continue;
      }

      if (message.isRead === true) {
        lastMessageIdsRef.current.add(message._id);
        continue;
      }

      if (isViewingChannel && message.channelId === channelId) {
        lastMessageIdsRef.current.add(message._id);
        continue;
      }

      if (
        isViewingConversation &&
        message.conversationId &&
        currentConversationId &&
        message.conversationId === currentConversationId
      ) {
        lastMessageIdsRef.current.add(message._id);
        continue;
      }

      // Show notification for new unread message
      let title = "New message";
      if (message.channelId) {
        const channel = channels?.find((ch) => ch._id === message.channelId);
        title = channel ? `# ${channel.name}` : `# Channel`;
      } else if (message.conversationId) {
        title = message.userName || "Direct message";
      } else {
        title = message.userName || "New message";
      }

      let messageText = "New message";
      try {
        const bodyData = JSON.parse(message.body);
        if (bodyData.ops && Array.isArray(bodyData.ops)) {
          const textParts = bodyData.ops
            .map((op: QuillOp) => {
              if (typeof op.insert === "string") {
                return op.insert;
              }
              return "";
            })
            .join("")
            .replace(/\n/g, " ")
            .trim();
          messageText = textParts.substring(0, 100) || "New message";
        }
      } catch {
        messageText = message.body.substring(0, 100) || "New message";
      }

      try {
        new Notification(title, {
          body: messageText,
          icon: "/logo.png",
          badge: "/logo.png",
          tag: message._id,
          requireInteraction: false,
        });

        lastMessageIdsRef.current.add(message._id);
      } catch (error) {
        console.error("Failed to show notification:", error);
      }
    }

    lastCheckTimeRef.current = now;

    if (lastMessageIdsRef.current.size > 200) {
      const ids = Array.from(lastMessageIdsRef.current);
      lastMessageIdsRef.current = new Set(ids.slice(-200));
    }
  }, [
    recentMessages,
    workspaceId,
    currentMember.data,
    channelId,
    memberId,
    currentConversationId,
    pathname,
    channels,
  ]);
};