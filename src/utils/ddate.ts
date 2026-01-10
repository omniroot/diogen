import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { capitalize } from "@/utils/capitalize.ts";

dayjs.extend(utc);

export const ddate = {
	// nowUTC: () => dayjs().utc(),

	// toUTC: (input: any) => dayjs(input).utc(),
	// toLocal: (input: any) => dayjs(input).utc().local(),

	// // Всегда строка только в ISO (UTC)
	// toDbString: (input: any) => dayjs(input).utc().toISOString(),

	// // Строгое отображение локально
	// // toUiString: (input: any) => dayjs(input).local().format("YYYY-MM-DD HH:mm"),

	// // Дата сегодня (локально)
	// today: () => dayjs().startOf("day"),

	// Получить YYYY-MM-DD
	getDate: (input: any) => dayjs(input).format("YYYY-MM-DD"),
	getRelativeLabel: (input: string) => {
		const now = dayjs();
		const date = dayjs(input);
		const diffInDays = date.diff(now, "day");

		if (Math.abs(diffInDays) < 1) {
			// TODO: use n18
			return "Сегодня";
		}

		return date.fromNow();
	},
	getFullNiceDate: (input: string) => {
		const date = dayjs(input);
		const dayName = capitalize(date.format("dddd"));
		const rest = `${date.format("D")} ${capitalize(date.format("D MMMM").split(" ")[1])}`;

		return `${dayName}, ${rest}`;
	},
};

// const today = new Date();
// console.log(ddate.toUTC(today).toString());
// console.log(ddate.toLocal(today).toDate());
// console.log(ddate.toLocal(today).toDate().toString());
