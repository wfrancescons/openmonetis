import { desc, eq } from "drizzle-orm";
import { apiTokens } from "@/db/schema";
import { db, schema } from "@/lib/db";

export interface UserPreferences {
	disableMagnetlines: boolean;
}

export interface ApiToken {
	id: string;
	name: string;
	tokenPrefix: string;
	lastUsedAt: Date | null;
	lastUsedIp: string | null;
	createdAt: Date;
	expiresAt: Date | null;
	revokedAt: Date | null;
}

export async function fetchAuthProvider(userId: string): Promise<string> {
	const userAccount = await db.query.account.findFirst({
		where: eq(schema.account.userId, userId),
	});
	return userAccount?.providerId || "credential";
}

export async function fetchUserPreferences(
	userId: string,
): Promise<UserPreferences | null> {
	const result = await db
		.select({
			disableMagnetlines: schema.userPreferences.disableMagnetlines,
		})
		.from(schema.userPreferences)
		.where(eq(schema.userPreferences.userId, userId))
		.limit(1);

	return result[0] || null;
}

export async function fetchApiTokens(userId: string): Promise<ApiToken[]> {
	return db
		.select({
			id: apiTokens.id,
			name: apiTokens.name,
			tokenPrefix: apiTokens.tokenPrefix,
			lastUsedAt: apiTokens.lastUsedAt,
			lastUsedIp: apiTokens.lastUsedIp,
			createdAt: apiTokens.createdAt,
			expiresAt: apiTokens.expiresAt,
			revokedAt: apiTokens.revokedAt,
		})
		.from(apiTokens)
		.where(eq(apiTokens.userId, userId))
		.orderBy(desc(apiTokens.createdAt));
}

export async function fetchAjustesPageData(userId: string) {
	const [authProvider, userPreferences, userApiTokens] = await Promise.all([
		fetchAuthProvider(userId),
		fetchUserPreferences(userId),
		fetchApiTokens(userId),
	]);

	return {
		authProvider,
		userPreferences,
		userApiTokens,
	};
}
