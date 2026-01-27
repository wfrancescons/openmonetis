import { eq } from "drizzle-orm";
import type { CategoryType } from "@/components/categorias/types";
import { type Categoria, categorias } from "@/db/schema";
import { db } from "@/lib/db";

export type CategoryData = {
	id: string;
	name: string;
	type: CategoryType;
	icon: string | null;
};

export async function fetchCategoriesForUser(
	userId: string,
): Promise<CategoryData[]> {
	const categoryRows = await db.query.categorias.findMany({
		where: eq(categorias.userId, userId),
	});

	return categoryRows.map((category: Categoria) => ({
		id: category.id,
		name: category.name,
		type: category.type as CategoryType,
		icon: category.icon,
	}));
}
