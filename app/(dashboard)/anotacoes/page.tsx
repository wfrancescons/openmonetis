import { NotesPage } from "@/components/anotacoes/notes-page";
import { getUserId } from "@/lib/auth/server";
import { fetchAllNotesForUser } from "./data";

export default async function Page() {
	const userId = await getUserId();
	const { activeNotes, archivedNotes } = await fetchAllNotesForUser(userId);

	return (
		<main className="flex flex-col items-start gap-6">
			<NotesPage notes={activeNotes} archivedNotes={archivedNotes} />
		</main>
	);
}
