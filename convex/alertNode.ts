"use node";

import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}


export async function sendAlertNotification(ctx: any, { category, alertLevel, location }: { category: string; alertLevel: string; location: string }) {
    const tokens = await ctx.db.query("userTokens").collect();
    const deviceTokens = tokens.map((t:any) => t.token);
  
    if (deviceTokens.length === 0) return;
  
    const message = {
      notification: {
        title: `🚨 New ${category} Alert`,
        body: `${alertLevel} alert at ${location}`,
      },
      tokens: deviceTokens,
    };
  
    try {
      await admin.messaging().sendEachForMulticast(message);
    } catch (error) {
      console.error("Error sending FCM:", error);
    }
  }
