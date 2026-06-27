import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const logSessionAction = mutation({
  args: {
    userId: v.string(),
    action: v.union(
      v.literal("session.created"),
      v.literal("session.ended"),
      v.literal("session.removed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sessions", {
      userId: args.userId,
      action: args.action,
    });
  },
});
