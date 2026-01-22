import { client } from "@/api/api.ts";
import { sleepMetricsTable, tablesDB } from "@/api/appwrite.ts";
import type { SleepMetrics } from "@/api/types/appwrite.js";
import { createCoreApi, createHooksApi } from "@/api/utils/appwrite.utils.tsx";

export const sleepMetricsCoreApi = createCoreApi<SleepMetrics>({
	tablesDB: tablesDB,
	databaseId: sleepMetricsTable?.databaseId,
	tableId: sleepMetricsTable?.$id,
});

export const sleepMetricsHooksApi = createHooksApi<SleepMetrics>({
	coreApis: sleepMetricsCoreApi,
	name: "sleep_metrics",
	queryClient: client,
});
