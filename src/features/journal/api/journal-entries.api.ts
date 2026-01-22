import { useIsMutating } from "@tanstack/react-query";
import { Permission } from "appwrite";
import { client } from "@/api/api.ts";
import { journalEntriesTable, tablesDB } from "@/api/appwrite.ts";
import type { JournalEntries } from "@/api/types/appwrite.js";
import {
	createCoreApi,
	createHooksApi,
	type DomainHook,
	type DomainHookMultiple,
	type OmitAppwrite,
} from "@/api/utils/appwrite.utils.tsx";
import { useAuth } from "@/features/auth/hooks/auth.hook.ts";

export const journalEntriesCoreApi = createCoreApi<JournalEntries>({
	tablesDB: tablesDB,
	databaseId: journalEntriesTable?.databaseId,
	tableId: journalEntriesTable?.$id,
});

export const journalEntriesHooksApi = createHooksApi<JournalEntries>({
	coreApis: journalEntriesCoreApi,
	name: "journal",
	queryClient: client,
});

type UseJournalEntriesList = {
	type: "list";
	queries: DomainHookMultiple<JournalEntries>["queries"];
	values?: any;
};

type UseJournalEntriesOne = {
	type: "one";
	queries?: DomainHook<JournalEntries>["queries"];
	values: Partial<{ id: string }>;
};

type UseJournalEntriesNone = {
	type: "null";
	queries?: any;
	values: any;
};

type UseJournalEntries =
	| UseJournalEntriesList
	| UseJournalEntriesOne
	| UseJournalEntriesNone;

export const useJournal = ({
	type,
	queries,
	// values,
}: Partial<UseJournalEntries> = {}) => {
	const raw = journalEntriesHooksApi;
	const { mutate: _createJournalEntry } = raw.useCreate();
	const { mutate: _updateJournalEntry } = raw.useUpdate();
	const { mutate: _deleteJournalEntry } = raw.useDelete();
	const isMutating = useIsMutating();
	const { user } = useAuth();

	const { data: journalEntries, isLoading: journalEntriesIsLoading } = raw.useList(
		{ user_id: { equal: user?.$id }, ...queries } as UseJournalEntries["queries"],
		{
			enabled: type === "list" && !!user?.$id,
		},
	);

	const domain = {
		createJournal: (
			newActivity: Partial<OmitAppwrite<JournalEntries>>,
			onSuccess?: () => void,
		) => {
			_createJournalEntry(
				{
					user_id: String(user?.$id),
					$permissions: [
						Permission.read(`user:${user?.$id}`),
						Permission.write(`user:${user?.$id}`),
						Permission.delete(`user:${user?.$id}`),
					],
					...newActivity,
				} as JournalEntries,

				{
					onSuccess: () => {
						raw.refetch.list();
						onSuccess?.();
					},
				},
			);
		},
		updateJournal: (
			$id?: string,
			newActivity?: Partial<OmitAppwrite<JournalEntries>>,
			onSuccess?: () => void,
		) => {
			if (!$id) throw Error("Update activity $id not found");

			_updateJournalEntry(
				{
					$id,
					...newActivity,
				} as JournalEntries,

				{
					onSuccess: () => {
						raw.refetch.list();
						onSuccess?.();
					},
				},
			);
		},
		deleteJournal: ($id?: string, onSuccess?: () => void) => {
			if (!$id) throw Error("Delete activity $id not found");
			_deleteJournalEntry(
				{ $id: $id },
				{
					onSuccess: () => {
						raw.refetch.list();
						onSuccess?.();
					},
				},
			);
		},
	};

	if (type === "list") {
		return {
			journalEntries,
			isLoading: journalEntriesIsLoading,
			isMutating,
			raw,
			domain,
		};
	} else if (type === "one") {
		return {
			// activity,
			isLoading: journalEntriesIsLoading,
			isMutating,
			raw,
			domain,
		};
	} else {
		return { isMutating, raw, domain };
	}
};
