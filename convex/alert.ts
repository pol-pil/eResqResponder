import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateAlertUrl = mutation(async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.storage.generateUploadUrl();
});

export const createAlert = mutation({
  args: {
    username: v.optional(v.string()),
    category: v.string(),
    location: v.string(),
    alertLevel: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    description: v.optional(v.string()),
    relatedCategory: v.optional(v.string()),
    status: v.string(),
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    let userId: string | null = null;
    let currentUser = null;

    if (identity) {
      currentUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
        .first();

      if (currentUser) userId = currentUser._id;
    }

    const alertId = await ctx.db.insert("alerts", {
      userId: currentUser?._id ?? undefined,
      category: args.category,
      location: args.location,
      alertLevel: args.alertLevel,
      latitude: args.latitude,
      longitude: args.longitude,
      description: args.description,
      relatedCategory: args.relatedCategory,
      status: args.status,
    });

    if (currentUser) {
      await ctx.db.patch(currentUser._id, {
        alerts: currentUser.alerts + 1,
      });
    }

    return alertId;
  },
});

export const cancelAlert = mutation({
    args: { alertId: v.id("alerts") },
    handler: async (ctx, { alertId }) => {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Unauthorized");
  
      const alert = await ctx.db.get(alertId);
      if (!alert) throw new Error("Alert not found");
  
      await ctx.db.patch(alertId, { status: "Canceled" });
  
      return true;
    },
  });

  export const getAlertById = query({
    args: {
      alertId: v.id("alerts"),
    },
    handler: async (ctx, { alertId }) => {
      const alert = await ctx.db.get(alertId);
      return alert || null;
    },
  });
  

export const getUserAlerts = query({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const results = await ctx.db
        .query("alerts")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .collect();
      return results;
    },
  });  


  export const getUserByClerkId = query({
    args: { clerkId: v.string() },
    handler: async (ctx, { clerkId }) => {
      return await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
        .first();
    },
  });