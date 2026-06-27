import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        firstname: v.string(),
        lastname: v.string(),
        address: v.string(),
        email: v.string(),
        contactNumber: v.string(),
        image: v.string(),
        alerts: v.number(),
        status: v.string(),
        role: v.string(),
        respondedNumber: v.optional(v.number()),
        isAvailable: v.optional(v.boolean()),
        clerkId: v.string(),
        fcmToken: v.optional(v.string()),
    }).index("by_clerk_id", ["clerkId"]),

    alerts: defineTable({
        userId: v.optional(v.id("users")),
        username: v.optional(v.string()),
        category: v.string(),
        location: v.string(),
        alertLevel: v.string(),
        latitude: v.optional(v.number()),
        longitude: v.optional(v.number()),
        status: v.string(),
        description: v.optional(v.string()),
        relatedCategory: v.optional(v.string()),
        responder: v.optional(v.array(v.string())),
        responderLatitude: v.optional(v.array(v.number())),
        responderLongitude: v.optional(v.array(v.number())),
        updatedAt: v.optional(v.number()),
    }).index("by_user", ["userId"]),

    sessions: defineTable({
        userId: v.string(),
        action: v.union(v.literal("session.created"), v.literal("session.ended"), v.literal("session.removed")),
    }).index("by_user", ["userId"]),

    userTokens: defineTable({
        token: v.string(),
    }),
});