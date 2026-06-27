import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
    args: {
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
    },
  
    handler: async (ctx, args) => {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .first();
  
      if (existingUser) {
        console.log(`User with clerkId ${args.clerkId} already exists. Skipping creation.`);
        return existingUser;
      }
  
      const newUser = await ctx.db.insert("users", {
        firstname: args.firstname,
        lastname: args.lastname,
        address: args.address,
        email: args.email,
        contactNumber: args.contactNumber,
        image: args.image,
        alerts: args.alerts,
        status: args.status,
        role: args.role,
        respondedNumber: args.respondedNumber || 0,
        isAvailable: args.isAvailable || false,
        clerkId: args.clerkId,
      });
  
      return newUser;
    },
  });

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

export const getCurrentUserAddress = query(async (ctx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("email"), identity.email))
    .first();

  return user?.address || null;
});

