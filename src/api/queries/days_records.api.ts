import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { type Models, Query } from "appwrite";
import { keyFactory } from "@/api/api.ts";
import { daysRecordsTable, tablesDB } from "@/api/appwrite.tsx";
import { createAppwriteHooks } from "@/api/appwrite.utils.ts";
import type { DaysRecords } from "@/api/types/appwrite.js";

export const {
	useList: useGetDaysRecords,
	useCreate: useCreateDayRecord,
	useUpdate: useUpdateDayRecord,
} = createAppwriteHooks<DaysRecords, Omit<DaysRecords, keyof Models.Row>>({
	tablesDB,
	databaseId: String(daysRecordsTable?.databaseId), //"6923a56a000f945ace60",
	tableId: String(daysRecordsTable?.$id), //"6923a6c90018e0309d7f",
	filters: {
		sleep_start: "equal",
		sleep_end: "equal",
		date: "equal",
	},
});

// const zeroingDateTime = (date: Date) => {
// 	date.setUTCHours(0, 0, 0, 0);
// 	return date;
// };

// const getQueriesBySpecificDate = (inputDate: string) => {
// 	// Если передано 'today', используем текущую дату
// 	const date = inputDate === "today" ? new Date() : new Date(inputDate);

// 	// Вычисление DateFrom и DateTo (как показано выше)
// 	const dateFrom = new Date(date);
// 	dateFrom.setUTCHours(0, 0, 0, 0);

// 	const dateTo = new Date(dateFrom);
// 	dateTo.setDate(dateTo.getDate() + 1);

// 	// Appwrite поддерживает Query.and/Query.or
// 	return Query.and([
// 		Query.greaterThanEqual("date", dateFrom.toISOString()),
// 		Query.lessThan("date", dateTo.toISOString()),
// 	]);
// };

interface UseGetDayRecordByDate {
	date: string;
}

export const useGetDayRecordByDate = (
	vars: UseGetDayRecordByDate,
	overrides: Partial<UseQueryOptions<DaysRecords>> = {},
) => {
	const key = keyFactory.days_records.one({ vars });
	return useQuery<DaysRecords>({
		queryKey: key,
		queryFn: async () => {
			console.log("@@@VARS", vars);

			const { rows } = await tablesDB.listRows<DaysRecords>({
				databaseId: String(daysRecordsTable?.databaseId),
				tableId: String(daysRecordsTable?.$id),
				queries: [Query.equal("date", vars.date)],
				total: false,
			});
			return rows[0] || null;
		},
		...overrides,
	});
};
