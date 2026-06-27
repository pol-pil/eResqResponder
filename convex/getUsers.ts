// convex/getUsers.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getUsers = query(async ({ db }) => {
   const users = await db.query("users").order("desc").collect();

   return users.map((user) => ({
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      address: user.address,
      alerts: user.alerts || "",
      image: user.image || "",
      status: user.status,
      _creationTime: user._creationTime,
      role: user.role,
   }));
});

export const approveUser = mutation({
   args: { userId: v.id("users") },
   handler: async (ctx, args) => {
      await ctx.db.patch(args.userId, { status: "approved" });
   },
});

export const rejectUser = mutation({
   args: { userId: v.id("users") },
   handler: async (ctx, args) => {
      await ctx.db.patch(args.userId, { status: "rejected" });
   },
});

export const assignResponder = mutation({
   args: { userId: v.id("users") },
   handler: async (ctx, args) => {
      await ctx.db.patch(args.userId, { role: "Responder" });
   },
});

export const assignResident = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
     await ctx.db.patch(args.userId, { role: "Resident" });
  },
});

