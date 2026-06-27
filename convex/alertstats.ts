import { query } from "./_generated/server";

export const getAlertStats = query(async ({ db }) => {
  const alerts = await db.query("alerts").collect();

  const grouped: Record<string, any> = {};

  const categoryMap: Record<string, any> = {
    "Health Emergency": "health",
    "Fire Emergency": "fire",
    "Flood or Weather Disaster": "flood",
    "Crime or Security Threat": "crime",
  };

  for (const alert of alerts) {
    const date = new Date(alert._creationTime).toISOString().split("T")[0];

    if (!grouped[date]) {
      grouped[date] = { date, health: 0, fire: 0, flood: 0, crime: 0 };
    }

    const key = categoryMap[alert.category];
    if (key) {
      grouped[date][key] += 1;
    }
  }

  return Object.values(grouped);
});
