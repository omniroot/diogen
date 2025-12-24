import {
	type UseMutationOptions,
	type UseQueryOptions,
	useMutation,
	useQuery,
} from "@tanstack/react-query";
import { client, keyFactory } from "@/api/api.ts";
import {
	type IHabit,
	type IHabitInsert,
	kaizen,
} from "@/api/supabase.ts";

interface UseGetHabits extends IHabit {}

export const useGetHabits = (
	{ ...vars }: Partial<UseGetHabits> = {},
	override: Partial<UseQueryOptions<IHabit[]>> = {},
) => {
	const key = keyFactory.habits.list({ vars });
	return useQuery<IHabit[]>({
		queryKey: key,
		queryFn: async () => {
			let query = kaizen.from("habits").select();
			Object.entries(vars).forEach(([key, value]) => {
				if (value) query = query.eq(key, value);
			});

			// if (limit) query = query.limit(limit);

			// if (orderByPosition) query = query.order("position");

			const { data, error } = await query;

			if (error) throw error;
			return data;
		},
		initialData: () => {
			return client.getQueryData(key);
		},
		placeholderData: () => {
			return client.getQueryData(key);
		},
		...override,
	});
};

interface UseGetHabit {
	id: IHabit["id"];
	title: IHabit["title"];
}

export const useGetHabit = (
	{ ...vars }: Partial<UseGetHabit> = {},
	override: Partial<UseQueryOptions<IHabit>> = {},
) => {
	const key = keyFactory.habits.list({ vars });
	return useQuery<IHabit>({
		queryKey: key,
		queryFn: async () => {
			let query = kaizen.from("habits").select();
			Object.entries(vars).forEach(([key, value]) => {
				if (value) query = query.eq(key, value);
			});

			// if (limit) query = query.limit(limit);

			// if (orderByPosition) query = query.order("position");

			const { data, error } = await query.select().single();

			if (error) throw error;
			return data;
		},
		initialData: () => {
			return client.getQueryData(key);
		},
		placeholderData: () => {
			return client.getQueryData(key);
		},
		...override,
	});
};

export const useCreateHabit = (
	{ ...vars }: Partial<UseGetHabits> = {},
	override: Partial<UseMutationOptions<IHabit, unknown, IHabitInsert>> = {},
) => {
	const key = keyFactory.habits.create({ vars });
	return useMutation<IHabit, unknown, IHabitInsert>({
		mutationKey: key,
		mutationFn: async (habit) => {
			const query = kaizen.from("habits").insert(habit);
			const { data, error } = await query.select().single();

			if (error) throw error;
			return data;
		},
		...override,
	});
};
