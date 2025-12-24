import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

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
};

// const today = new Date();
// console.log(ddate.toUTC(today).toString());
// console.log(ddate.toLocal(today).toDate());
// console.log(ddate.toLocal(today).toDate().toString());
