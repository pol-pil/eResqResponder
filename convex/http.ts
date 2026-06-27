import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error("Missing CLERK_WEBHOOK_SECRET");

    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Missing Svix headers", { status: 400 });
    }

    const body = JSON.stringify(await request.json());
    const wh = new Webhook(webhookSecret);
    let evt: any;

    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (err) {
      console.error("Webhook verification failed:", err);
      return new Response("Invalid webhook", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url, unsafe_metadata } = evt.data;
      const email = email_addresses[0]?.email_address || "";
      const address = unsafe_metadata?.address || "";
      const contactNumber = unsafe_metadata?.contactNumber || "";

      try {
        await ctx.runMutation(api.users.createUser, {
          clerkId: id,
          firstname: first_name || "",
          lastname: last_name || "",
          email,
          image: image_url || "",
          address: address,
          contactNumber: contactNumber,
          alerts: 0,
          status: "pending",
          role: "Resident",
        });
      } catch (error) {
        console.error("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    } else if (eventType.startsWith("session.")) {
      const { user_id } = evt.data;
      let action = eventType; // session.created, session.ended, session.removed

      try {
        await ctx.runMutation(api.sessions.logSessionAction, {
          userId: user_id,
          action,
        });
      } catch (error) {
        console.error(`Error logging ${action}:`, error);
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  }),
});

export default http;
