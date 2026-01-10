// const buildKey = (...parts: any[]) => {
// 	const clean = (value: any): any => {
// 		if (value === null || value === undefined) return undefined;
// 		// ---------- 1. ТУПЛЫ (["name", value]) ----------
// 		if (Array.isArray(value) && value.length === 2 && typeof value[0] === "string") {
// 			return { [value[0]]: clean(value[1]) };
// 		}
// 		// ---------- 2. ПУСТЫЕ МАССИВЫ ----------
// 		if (Array.isArray(value)) {
// 			if (value.length === 0) return undefined;
// 			return value.map(clean).filter((v) => v !== undefined);
// 		}
// 		// ---------- HANDLE DATES BEFORE OBJECTS ----------
// 		if (value instanceof Date) {
// 			return value.toISOString(); // Serialize Date to ISO string for key stability
// 		}
// 		// ---------- 3. ОБЪЕКТЫ ----------
// 		if (typeof value === "object") {
// 			const entries = Object.entries(value)
// 				.map(([k, v]) => [k, clean(v)])
// 				.filter(([_, v]) => v !== undefined)
// 				.sort(([a], [b]) => a.localeCompare(b));
// 			if (entries.length === 0) return undefined;
// 			return Object.fromEntries(entries);
// 		}
// 		// ---------- 4. ПРИМИТИВЫ ----------
// 		return value;
// 	};
// 	return parts.map(clean).filter((v) => v !== undefined); // убираем undefined после чистки
// };
