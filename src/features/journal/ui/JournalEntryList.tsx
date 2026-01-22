import type { JournalEntries } from "@/api/types/appwrite.js";
import type { DomainHookMultiple } from "@/api/utils/appwrite.utils.tsx";
import { useJournal } from "@/features/journal/api/journal-entries.api.ts";
import { JournalEntryItem } from "@/features/journal/ui/JournalEntryItem.tsx";
import { KaizenList } from "@/theme/ui/KaizenList.tsx";

interface Props {
	queries?: DomainHookMultiple<JournalEntries>["queries"];
}
export const JournalEntryList: React.FC<Props> = ({ queries }) => {
	const { journalEntries } = useJournal({ type: "list", queries });
	return (
		<KaizenList.Root>
			{journalEntries?.map((journalEntry) => {
				return (
					<KaizenList.Item key={journalEntry.$id} asChild>
						<JournalEntryItem journalEntry={journalEntry} />
					</KaizenList.Item>
				);
			})}
		</KaizenList.Root>
	);
};
