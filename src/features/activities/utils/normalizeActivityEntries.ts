import dayjs from "dayjs";
import type { ActivityEntries } from "@/api/types/appwrite.js";
import { ddate } from "@/utils/ddate.ts";
import { generateUniqueId } from "@/utils/generateRandomId.tsx";

export const normalizeActivityEntries = (
	records: ActivityEntries[],
	length = 10,
	fromDate: null | string = null,
): ActivityEntries[] => {
	const map = new Map<string, ActivityEntries>();

	// кладём все записи в map по дате (YYYY-MM-DD)
	records.forEach((r) => {
		const key = dayjs(r.date).format("YYYY-MM-DD");
		map.set(key, r);
	});

	const result: ActivityEntries[] = [];

	for (let i = 0; i < length; i++) {
		const date = fromDate
			? dayjs(fromDate).subtract(i, "day")
			: dayjs().subtract(i, "day");
		const key = date.format("YYYY-MM-DD");

		const record = map.get(key);

		result.push(
			record ?? {
				...records[0],
				$id: `null-${generateUniqueId()}`,
				date: ddate.getDate(date),
				completed: false,
			},
		);
	}

	// чтобы слева старые, справа новые
	return result.reverse();
};
