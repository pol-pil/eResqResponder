import { query } from "./_generated/server";

export const getLiveAlerts = query(async ({ db }) => {
  const alerts = await db.query("alerts").order("desc").collect();

  const results = await Promise.all(
    alerts.map(async (alert) => {
      const user = alert.userId ? await db.get(alert.userId) : null;

      if (!alert) return null;

      return {
        _id: alert._id,
        category: alert.category,
        location: alert.location,
        alertLevel: alert.alertLevel,
        latitude: alert.latitude,
        longitude: alert.longitude,
        userName: user
          ? [user.firstname, user.lastname].filter(Boolean).join(" ")
          : alert.username || "Unknown",
        _creationTime: alert._creationTime,
        status: alert.status || "Active",
        description: alert.description || "",
        relatedCategory: alert.relatedCategory || "",
        responder: Array.isArray(alert.responder) ? alert.responder : [],
        responderLatitude: Array.isArray(alert.responderLatitude) ? alert.responderLatitude : [],
        responderLongitude: Array.isArray(alert.responderLongitude) ? alert.responderLongitude : [],
      };
    })
  );

  // remove any nulls from the array
  return results.filter((r) => r !== null);
});
