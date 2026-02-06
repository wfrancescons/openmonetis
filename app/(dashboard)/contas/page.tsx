import { AccountsPage } from "@/components/contas/accounts-page";
import { getUserId } from "@/lib/auth/server";
import { fetchAllAccountsForUser } from "./data";

export default async function Page() {
	const userId = await getUserId();
	const { activeAccounts, archivedAccounts, logoOptions } =
		await fetchAllAccountsForUser(userId);

	return (
		<main className="flex flex-col items-start gap-6">
			<AccountsPage
				accounts={activeAccounts}
				archivedAccounts={archivedAccounts}
				logoOptions={logoOptions}
			/>
		</main>
	);
}
