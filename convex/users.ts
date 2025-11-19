import { auth } from "./auth";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { z } from "zod";
export const current = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }
    return await ctx.db.get(userId);
  },
});

export const recordActivity = mutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("checkin"),
      v.literal("checkout"),
      v.literal("breakin"),
      v.literal("breakout")
    ),
    breakType: v.optional(v.string()),
    start: v.number(),
    end: v.number(),
    reason: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const { userId, type, breakType, start, end, reason } = args;

    // Validate activity types
    const validTypes = ["checkin", "checkout", "breakin", "breakout"];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid activity type: ${type}`);
    }

    // Validate break types (only when type is breakin or breakout)
    const validBreakTypes = [
      "Meal break",
      "Out of Office",
      "Toilet",
      "Meeting",
      "Training",
      "Called by HR",
      "Other",
    ];

    if (type === "breakin" || type === "breakout") {
      if (!breakType) {
        throw new Error(`breakType is required for ${type}`);
      }

      if (!validBreakTypes.includes(breakType)) {
        throw new Error(`Invalid break type: ${breakType}`);
      }
    }

    // Validate non-break types (breakType must NOT be passed)
    if ((type === "checkin" || type === "checkout") && breakType) {
      throw new Error(`breakType must not be provided for ${type}`);
    }

    // Insert into DB
    await ctx.db.insert("userActivity", {
      userId,
      type,
      breakType: breakType,
      timestamp: Date.now(),
      start,
      end,
      reason: reason,
    });

    return {
      success: true,
      message: `User ${type} successfully`,
    };
  },
});

export const removeUser = mutation({
  args: {
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check admin authentication
    const adminId = await getAuthUserId(ctx);
    if (!adminId) throw new Error("Unauthorized");

    const userId = args.id;

    // Remove credentials
    const credential = await ctx.db
      .query("credentials")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (credential) {
      await ctx.db.delete(credential._id);
    }

    // Remove user status
    const status = await ctx.db
      .query("userStatus")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (status) {
      await ctx.db.delete(status._id);
    }

    await ctx.db.delete(userId);

    return {
      success: true,
      message: "User and related data deleted successfully.",
    };
  },
});

export const updatedStatus = mutation({
  args: {
    status: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { status, userId } = args;

    if (status !== "active" && status !== "inactive") {
      throw new Error("Status must be 'active' or 'inactive'");
    }

    // Check if a record already exists for this user
    const existing = await ctx.db
      .query("userStatus")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      // Update existing status
      await ctx.db.patch(existing._id, { status });
    } else {
      await ctx.db.insert("userStatus", { userId, status });
    }

    return {
      userId,
      message: `Status updated to ${status}`,
    };
  },
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  userId: z.string(),
});

export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const parsed = updateUserSchema.safeParse({
      name: args.name,
      image: args.image,
      email: args.email,
      phone: args.phone,
      userId: args.userId ?? args.userId,
    });

    if (!parsed.success) {
      const messages = parsed.error.issues.map((i) => i.message).join(", ");
      throw new Error(messages);
    }

    const { userId, ...updateData } = args;

    const existingUser = await ctx.db.get(userId);
    if (!existingUser) {
      throw new Error("User not found");
    }

    await ctx.db.patch(userId, updateData);

    const updatedUser = await ctx.db.get(userId);

    return {
      message: "User updated successfully",
      user: updatedUser,
    };
  },
});

export const getList = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    const result = await Promise.all(
      users.map(async (user) => {
        const statusList = await ctx.db
          .query("userStatus")
          .withIndex("by_user_id", (q) => q.eq("userId", user._id))
          .collect();

        const latestStatus = statusList?.[statusList.length - 1]?.status ?? "";

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          userStatus: latestStatus,
          created_at: user._creationTime,
        };
      })
    );

    return result;
  },
});

export const getUserActivity = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("userActivity")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    activities.sort((a, b) => b.timestamp - a.timestamp);

    return activities.map((a) => ({
      id: a._id,
      type: a.type,
      breakType: a.breakType ?? null,
      timestamp: a.timestamp,
      start: a.start ?? null,
      end: a.end ?? null,
      reason: a.reason ?? null,
    }));
  },
});

export const getBreakReport = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const activities = await ctx.db
      .query("userActivity")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    if (activities.length === 0) return [];

    activities.sort((a, b) => a.timestamp - b.timestamp);

    const validBreakTypes = [
      "Meal break",
      "Out of Office",
      "Toilet",
      "Meeting",
      "Training",
      "Called by HR",
      "Other",
    ];

    let lastBreakin: { type: string; startTimestamp: number } | null = null;

    const breakReport: {
      date: string;
      startTime: string;
      endTime: string;
      total: string;
      breakType: string;
    }[] = [];

    for (const act of activities) {
      // BREAK IN
      if (
        act.type === "breakin" &&
        act.breakType &&
        validBreakTypes.includes(act.breakType)
      ) {
        lastBreakin = {
          type: act.breakType,
          startTimestamp: act.start ?? act.timestamp,
        };
      }

      // BREAK OUT
      if (act.type === "breakout" && lastBreakin !== null) {
        const start = new Date(lastBreakin.startTimestamp);
        const end = new Date(act.end ?? act.timestamp);

        const diffMs = Math.abs(
          (act.end ?? act.timestamp) - lastBreakin.startTimestamp
        );
        const totalMins = Math.floor(diffMs / 1000 / 60);
        const hours = Math.floor(totalMins / 60);
        const mins = totalMins % 60;

        breakReport.push({
          date: start.toISOString().split("T")[0],
          startTime: start.toTimeString().split(" ")[0],
          endTime: end.toTimeString().split(" ")[0],
          total: `${hours} hr ${mins} mins`,
          breakType: lastBreakin.type,
        });

        lastBreakin = null;
      }
    }

    return breakReport;
  },
});

export const getDailySummary = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const normalize = (ts: number) => (ts < 2000000000 ? ts * 1000 : ts);

    const activities = await ctx.db
      .query("userActivity")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    if (activities.length === 0) {
      return {
        checkIn: null,
        totalHours: "0 hr 0 mins",
        totalBreak: "0 hr 0 mins",
        totalWork: "0 hr 0 mins",
      };
    }

    activities.sort((a, b) => normalize(a.timestamp) - normalize(b.timestamp));

    let lastCheckinTime: number | null = null;
    const workSessions: { start: number; end: number }[] = [];
    const breakSessions: { start: number; end: number }[] = [];

    let lastCheckin: number | null = null;
    let lastBreakin: number | null = null;

    for (const act of activities) {
      const ts = normalize(act.timestamp);
      const start = act.start ? normalize(act.start) : ts;
      const end = act.end ? normalize(act.end) : ts;

      if (act.type === "checkin") {
        lastCheckin = start;
        lastCheckinTime = start;
      }

      if (act.type === "checkout" && lastCheckin !== null) {
        workSessions.push({ start: lastCheckin, end });
        lastCheckin = null;
      }

      if (act.type === "breakin") {
        lastBreakin = start;
      }

      if (act.type === "breakout" && lastBreakin !== null) {
        breakSessions.push({ start: lastBreakin, end });
        lastBreakin = null;
      }
    }

    const totalWorkMs = workSessions.reduce(
      (sum, s) => sum + (s.end - s.start),
      0
    );

    const totalBreakMs = breakSessions.reduce(
      (sum, s) => sum + (s.end - s.start),
      0
    );

    const netWorkMs = Math.max(totalWorkMs - totalBreakMs, 0);

    const formatDuration = (ms: number) => {
      const totalMins = Math.floor(ms / 1000 / 60);
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      return `${hrs} hr ${mins} mins`;
    };

    const formatDateTime = (ts: number) =>
      new Date(ts).toLocaleString("en-GB", {
        timeZone: "Asia/Phnom_Penh",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

    return {
      checkIn: lastCheckinTime ? formatDateTime(lastCheckinTime) : null,
      totalHours: formatDuration(totalWorkMs),
      totalBreak: formatDuration(totalBreakMs),
      totalWork: formatDuration(netWorkMs),
    };
  },
});