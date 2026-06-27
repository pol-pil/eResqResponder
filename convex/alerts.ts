// convex/alerts.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const updateAlert = mutation({
   args: {
     id: v.id("alerts"),
     status: v.string(),
     description: v.optional(v.string()),
     responder: v.optional(v.array(v.string())),
     responderLatitude: v.optional(v.array(v.number())),
     responderLongitude: v.optional(v.array(v.number())),
   },
   handler: async (ctx, args) => {
     const updateData: any = { status: args.status };
 
     if (args.description !== undefined) updateData.description = args.description;
     if (args.responder !== undefined) updateData.responder = args.responder;
     if (args.responderLatitude !== undefined) updateData.responderLatitude = args.responderLatitude;
     if (args.responderLongitude !== undefined) updateData.responderLongitude = args.responderLongitude;
 
     await ctx.db.patch(args.id, updateData);
   },
 });
 

export const deleteAlert = mutation({
   args: {
      id: v.id("alerts"),
   },
   handler: async (ctx, args) => {
      await ctx.db.delete(args.id);
   },
});

export const updateUsername = mutation({
   args: {
      id: v.id("alerts"),
      username: v.string(),
   },
   handler: async (ctx, args) => {
      await ctx.db.patch(args.id, { username: args.username });
   },
});


