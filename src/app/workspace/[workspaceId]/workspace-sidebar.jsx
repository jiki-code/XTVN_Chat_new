import React, { useState, useEffect, useCallback } from "react";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useChannelId } from "@/hooks/use-channel-id";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
} from "lucide-react";

import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { WorkspaceSection } from "./workspace-section";
import { UserItem } from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useMemberId } from "@/hooks/use-member-id";
import { usePathname } from "next/navigation";
import { useGetUnreadCounts } from "@/features/messages/api/use-get-unread-counts";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
const WorkspaceSidebar = () => {
  const pathname = usePathname();
  const isThreadsUrl = pathname.endsWith("threads");
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const [_open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  const [channelList, setChannelList] = useState(channels || []);
  const [memberList, setMemberList] = useState(members || []);

  useEffect(() => {
    if (channels) setChannelList(channels);
  }, [channels]);

  useEffect(() => {
    if (members) setMemberList(members);
  }, [members]);

  const onDragEnd = useCallback(
    (result) => {
      const { source, destination, type } = result;
      if (!destination) return;

      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      ) {
        return;
      }

      if (type === "channel") {
        const newItems = reorder(channelList, source.index, destination.index);
        setChannelList(newItems);
        // TODO: call API to persist channel order
      }

      if (type === "member") {
        const newMembers = reorder(memberList, source.index, destination.index);
        setMemberList(newMembers);
        // TODO: call API to persist member order
      }
    },
    [channelList, memberList]
  );

  const unreadCounts = useGetUnreadCounts({ workspaceId });
  if (workspaceLoading || memberLoading || channelsLoading || membersLoading) {
    return (
      <div className="flex flex-col bg-[#030637] h-full items-center justify-center">
        <Loader className="size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#030637] h-full items-center justify-center">
        <AlertTriangle className="size-5 text-white" />
        <p className="text-white text-sm">Workspace not found</p>
      </div>
    );
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col bg-[#030637] h-full">
        <WorkspaceHeader
          workspace={workspace}
          isAdmin={member.role === "admin"}
        />

        <div className="flex flex-col px-2 mt-3">
          <SidebarItem
            isChannel={false}
            label="Threads"
            icon={MessageSquareText}
            id="threads"
            variant={isThreadsUrl ? "active" : "default"}
          />
        </div>

        {/* Channels */}
        <WorkspaceSection
          label="Channels"
          hint="New Channel"
          onNew={() => {
            if (member.role === "admin") setOpen(true);
          }}
        >
          <Droppable droppableId="channels" type="channel">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {channelList.map((item, index) => (
                  <Draggable
                    key={item._id}
                    draggableId={item._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <SidebarItem
                          isChannel={true}
                          icon={HashIcon}
                          label={item.name}
                          id={item._id}
                          variant={
                            channelId === item._id ? "active" : "default"
                          }
                          unreadCount={
                            unreadCounts.data?.channels?.[item._id] || 0
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </WorkspaceSection>

        {/* Direct Messages */}
        <WorkspaceSection
          label="Direct Messages"
          hint="New Direct Message"
          onNew={() => {}}
        >
          <Droppable droppableId="members" type="member">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {memberList.map((item, index) => (
                  <Draggable
                    key={item._id}
                    draggableId={item._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <UserItem
                          id={item._id}
                          label={item.user.name}
                          image={item.user.image}
                          variant={
                            item._id === memberId ? "active" : "default"
                          }
                          unreadCount={
                            unreadCounts.data?.conversations?.[item._id] || 0
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </WorkspaceSection>
      </div>
    </DragDropContext>
  );
};

export default WorkspaceSidebar;
