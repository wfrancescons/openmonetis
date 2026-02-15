import { InboxPage } from "@/components/pre-lancamentos/inbox-page";
import { getUserId } from "@/lib/auth/server";
import { fetchAppLogoMap, fetchInboxDialogData, fetchInboxItems } from "./data";

export default async function Page() {
	const userId = await getUserId();

	const [pendingItems, processedItems, discardedItems, dialogData, appLogoMap] =
		await Promise.all([
			fetchInboxItems(userId, "pending"),
			fetchInboxItems(userId, "processed"),
			fetchInboxItems(userId, "discarded"),
			fetchInboxDialogData(userId),
			fetchAppLogoMap(userId),
		]);

	return (
		<main className="flex flex-col items-start gap-6">
			<InboxPage
				pendingItems={pendingItems}
				processedItems={processedItems}
				discardedItems={discardedItems}
				pagadorOptions={dialogData.pagadorOptions}
				splitPagadorOptions={dialogData.splitPagadorOptions}
				defaultPagadorId={dialogData.defaultPagadorId}
				contaOptions={dialogData.contaOptions}
				cartaoOptions={dialogData.cartaoOptions}
				categoriaOptions={dialogData.categoriaOptions}
				estabelecimentos={dialogData.estabelecimentos}
				appLogoMap={appLogoMap}
			/>
		</main>
	);
}
