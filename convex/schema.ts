import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,
  credentials: defineTable({
    userId: v.id("users"),
    hashedPassword: v.string(),
  }).index("by_user_id", ["userId"]),
  userStatus: defineTable({
    userId: v.id("users"),
    status: v.string(),
  }).index("by_user_id", ["userId"]),
  workspaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string(),
  }),
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_workspace_id_user_id", ["workspaceId", "userId"]),
  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workspaces"),
  }).index("by_workspace_id", ["workspaceId"]),
  channelMembers: defineTable({
    channelId: v.id("channels"),
    userId: v.id("users"),
    
  })
    .index("by_channel_id", ["channelId"])
    .index("by_user_id", ["userId"])
    .index("by_channel_id_user_id", ["channelId", "userId"]),
  conversations: defineTable({
    workspaceId: v.id("workspaces"),
    memberOneId: v.id("members"),
    memberTwoId: v.id("members"),
  }).index("by_workspace_id", ["workspaceId"]),
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
    isRead: v.optional(v.boolean()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_member_id", ["memberId"])
    .index("by_channel_id", ["channelId"])
    .index("by_conversation_id", ["conversationId"])
    .index("by_parent_message_id", ["parentMessageId"])
    .index("by_channel_id_parent_message_id_conversation_id", [
      "channelId",
      "parentMessageId",
      "conversationId",
    ])
    .index("by_workspace_isRead_parent", [
      "workspaceId",
      "isRead",
      "parentMessageId",
    ]),
  reactions: defineTable({
    workspaceId: v.id("workspaces"),
    messageId: v.id("messages"),
    memberId: v.id("members"),
    value: v.string(),
  })
    .index("by_workspace_id", ["workspaceId"])
    .index("by_message_id", ["messageId"])
    .index("by_member_id", ["memberId"]),
  userActivity: defineTable({
    userId: v.id("users"),
      type: v.union(
        v.literal("checkin"),
        v.literal("checkout"),
        v.literal("breakin"),
        v.literal("breakout")
      ),
    breakType: v.optional(v.string()),
    timestamp: v.number(),
    start: v.optional(v.number()),
    end: v.optional(v.number()),
    reason: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),
});

export default schema;
