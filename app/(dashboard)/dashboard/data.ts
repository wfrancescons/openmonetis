import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/db";

export interface UserDashboardPreferences {
	disableMagnetlines: boolean;
	dashboardWidgets: string | null;
}

export async function fetchUserDashboardPreferences(
	userId: string,
): Promise<UserDashboardPreferences> {
	const result = await db
		.select({
			disableMagnetlines: schema.userPreferences.disableMagnetlines,
			dashboardWidgets: schema.userPreferences.dashboardWidgets,
		})
		.from(schema.userPreferences)
		.where(eq(schema.userPreferences.userId, userId))
		.limit(1);

	return {
		disableMagnetlines: result[0]?.disableMagnetlines ?? false,
		dashboardWidgets: result[0]?.dashboardWidgets ?? null,
	};
}
