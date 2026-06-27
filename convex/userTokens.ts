import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const saveToken = mutation({
  args: { token: v.string() },
  handler: async (ctx, { token }) => {
    const existing = await ctx.db
      .query("userTokens")
      .filter((q) => q.eq(q.field("token"), token))
      .first();
    if (!existing) await ctx.db.insert("userTokens", { token });
  },
});