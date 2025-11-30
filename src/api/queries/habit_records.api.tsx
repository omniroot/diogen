// import {
// 	type UseMutationOptions,
// 	type UseQueryOptions,
// 	useMutation,
// 	useQuery,
// } from "@tanstack/react-query";
// import { client, keyFactory } from "@/api/api.ts";
// import {
// 	type IHabit,
// 	type IHabitsRecords,
// 	type IHabitsRecordsInsert,
// 	type IHabitsRecordsUpdate,
// 	kaizen,
// } from "@/api/supabase.ts";

// interface useGetHabitRecords extends IHabitsRecords {}

// export const useGetHabitRecords = (
// 	{ ...vars }: Partial<useGetHabitRecords> = {},
// 	override: Partial<UseQueryOptions<IHabitsRecords[]>> = {},
// ) => {
// 	const key = keyFactory.habits.list({ vars });

// 	return useQuery<IHabitsRecords[]>({
// 		queryKey: key,
// 		queryFn: async () => {
// 			let query = kaizen.from("habit_records").select();
// 			Object.entries(vars).forEach(([key, value]) => {
// 				if (value) query = query.eq(key, value);
// 			});

// 			// if (limit) query = query.limit(limit);

// 			// if (orderByPosition) query = query.order("position");

// 			const { data, error } = await query.select();

// 			if (error) throw error;
// 			return data;
// 		},
// 		initialData: () => {
// 			return client.getQueryData(key);
// 		},
// 		placeholderData: () => {
// 			return client.getQueryData(key);
// 		},
// 		...override,
// 	});
// };

// export const useCreateHabitRecord = (
// 	{ ...vars }: Partial<useGetHabitRecords> = {},
// 	override: Partial<
// 		UseMutationOptions<IHabitsRecords, unknown, IHabitsRecordsInsert>
// 	> = {},
// ) => {
// 	const key = keyFactory.habit_records.create({ vars });
// 	return useMutation<IHabitsRecords, unknown, IHabitsRecordsInsert>({
// 		mutationKey: key,
// 		mutationFn: async (habit) => {
// 			const query = kaizen.from("habit_records").insert(habit);
// 			const { data, error } = await query.select().single();

// 			if (error) throw error;
// 			return data;
// 		},
// 		...override,
// 	});
// };

// export interface UseUpdateHabitRecords {
// 	ids: IHabitsRecords["id"] | IHabitsRecords["id"][];
// 	data: Partial<IHabitsRecords>;
// }

// export const useUpdateHabitRecord = (
// 	{ ...vars }: Partial<UseUpdateHabitRecords> = {},
// 	override: Partial<
// 		UseMutationOptions<IHabitsRecords[], unknown, UseUpdateHabitRecords>
// 	> = {},
// ) => {
// 	const key = keyFactory.habit_records.update({ vars });
// 	return useMutation<IHabitsRecords[], unknown, UseUpdateHabitRecords>({
// 		mutationKey: key,
// 		mutationFn: async ({ ids, data: newData }) => {
// 			const idsArray = Array.isArray(ids) ? ids : [ids];

// 			const { data, error } = await kaizen
// 				.from("habit_records")
// 				.update(newData)
// 				.in("id", idsArray)
// 				.select();

// 			if (error) throw error;

// 			return data;
// 		},

// 		...override,
// 	});
// };
