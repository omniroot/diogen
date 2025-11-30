import { Checkbox, HStack, Icon, Text } from "@chakra-ui/react";
import { type FC, useEffect, useState } from "react";
import {
	useCreateHabitRecord,
	useGetHabitRecords,
	useUpdateHabitRecord,
} from "@/api/queries/habit_records.api.tsx";
import type { IHabit } from "@/api/supabase.ts";
import { useHabitsStore } from "@/stores/habits.store.tsx";
import { EmojiPicker } from "@/theme/components/EmojiPicker.tsx";

interface IProps {
	habit: IHabit;
}

export const HabitItem: FC<IProps> = ({ habit }) => {
	const { selectedDate } = useHabitsStore();
	const { data: habitRecord } = useGetHabitRecords({
		habit_id: habit.id,
		date: selectedDate.toISOString().split("T")[0],
	});
	const { mutate: createHabitRecord } = useCreateHabitRecord();
	const { mutate: updateHabitRecord } = useUpdateHabitRecord();
	const [checked, setChecked] = useState(false);

	console.log({ bd: habitRecord?.[0]?.completed, state: checked });

	useEffect(() => {
		setChecked(habitRecord?.[0]?.completed || false);
	}, [habitRecord]);

	const hasRecord = habitRecord?.[0] || false;
	const onChecked = (newValue: boolean) => {
		if (!hasRecord) {
			createHabitRecord({
				habit_id: habit.id,
				completed: newValue,
				date: selectedDate.toISOString().split("T")[0],
			});
		} else {
			updateHabitRecord({
				ids: habitRecord?.[0].id || -999999999999,
				data: {
					// habit_id: habit.id,
					completed: newValue,
					// date: selectedDate.toISOString().split("T")[0],
				},
			});
		}
		setChecked(newValue);
	};

	console.log("@tds", selectedDate.toISOString().split("T")[0]);

	return (
		<HStack
			w={"100%"}
			justifyContent={"space-between"}
			p={2}
			border={"1px solid transparent"}
		>
			<HStack>
				<EmojiPicker initialEmoji={String(habit.icon)} onlyPreview />
				<Text>{habit.title}</Text>
			</HStack>

			<HStack>
				<Checkbox.Root checked={checked} onCheckedChange={(e) => onChecked(!!e.checked)}>
					<Checkbox.HiddenInput />
					<Checkbox.Control />
					{/* <Checkbox.Label></Checkbox.Label> */}
				</Checkbox.Root>
			</HStack>
		</HStack>
	);
};
