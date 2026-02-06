import { CardsPage } from "@/components/cartoes/cards-page";
import { getUserId } from "@/lib/auth/server";
import { fetchAllCardsForUser } from "./data";

export default async function Page() {
	const userId = await getUserId();
	const { activeCards, archivedCards, accounts, logoOptions } =
		await fetchAllCardsForUser(userId);

	return (
		<main className="flex flex-col items-start gap-6">
			<CardsPage
				cards={activeCards}
				archivedCards={archivedCards}
				accounts={accounts}
				logoOptions={logoOptions}
			/>
		</main>
	);
}
