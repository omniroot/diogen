import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { AppwriteException, type Models, Query } from "appwrite";
import { keyFactory } from "@/api/api.ts";
import { daysRecordsTable, tablesDB } from "@/api/appwrite.tsx";
import { createAppwriteHooks } from "@/api/appwrite.utils.ts";
import type { DaysRecords } from "@/api/types/appwrite.js";
import { toaster } from "@/theme/components/toaster";

/**
 * API для работы с записями дней (days_records).
 *
 * ВАЖНО: Все datetime поля (sleep_start, sleep_end) хранятся в БД в формате ISO-UTC.
 * - Перед сохранением в БД: конвертируем локальное время -> ISO-UTC (localTimeToISO)
 * - После получения из БД: конвертируем ISO-UTC -> локальное время (isoToLocalTime)
 *
 * Поле date хранится в формате YYYY-MM-DD (без времени).
 */

export const {
  useList: useGetDaysRecords,
  useCreate: useCreateDayRecord,
  useUpdate: useUpdateDayRecord,
} = createAppwriteHooks<DaysRecords, Omit<DaysRecords, keyof Models.Row>>({
  tablesDB,
  databaseId: String(daysRecordsTable?.databaseId),
  tableId: String(daysRecordsTable?.$id),
  filters: {
    sleep_start: "equal",
    sleep_end: "equal",
    date: "equal",
  },
});

interface UseGetDayRecordByDate {
  date: string; // Ожидаемый формат: YYYY-MM-DD
}

/**
 * Получает запись дня по дате.
 * @param vars.date - Дата в формате YYYY-MM-DD
 * @returns DaysRecords с полями sleep_start и sleep_end в формате ISO-UTC
 */
export const useGetDayRecordByDate = (
  vars: UseGetDayRecordByDate,
  overrides: Partial<UseQueryOptions<DaysRecords>> = {},
) => {
  const key = keyFactory.days_records.one({ vars });
  return useQuery<DaysRecords>({
    queryKey: key,
    queryFn: async () => {
      try {
        const { rows } = await tablesDB.listRows<DaysRecords>({
          databaseId: String(daysRecordsTable?.databaseId),
          tableId: String(daysRecordsTable?.$id),
          queries: [Query.equal("date", vars.date)],
          total: false,
        });

        console.log("Rows", rows);
        return rows[0] ?? null;
      } catch (error) {
        console.error("Error fetching day record:", error); // Логируем оригинальную ошибку
        throw error; // Бросаем саму ошибку
      }
    },

    ...overrides,
  });
};
