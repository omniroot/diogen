import { Box, Button, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import { type MouseEvent, useState } from "react";
import { keyFactory } from "@/api/api.ts";
import {
	useCreateHabitRecord,
	useGetHabitsRecords,
	useUpdateHabitRecord,
} from "@/api/appwrite.tsx";
import type { HabitsRecords } from "@/api/types/appwrite.js";
import { useHabitsStore } from "@/stores/habits.store.tsx";
import { toaster } from "@/theme/components/toaster.tsx";
import { ddate } from "@/utils/ddate.ts";

interface Props {
	record: HabitsRecords;
	showDay?: "inside" | "upper";
}
export const HabitRecordItem: React.FC<Props> = ({ record, showDay = "inside" }) => {
	const [completed, setCompleted] = useState(record.completed);
	const { data: habitRecord } = useGetHabitsRecords(
		{
			date: record.date,
			habit_id: record.habit_id,
		},
		{ enabled: false },
	);
	const { mutate: createHabitRecord } = useCreateHabitRecord();
	const { mutate: updateHabitRecord } = useUpdateHabitRecord();

	const onHabitRecordClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		const nextCompletedState = !completed;
		setCompleted(nextCompletedState);
		if (habitRecord?.length) {
			updateHabitRecord({
				id: habitRecord[0].$id,
				vars: { completed: nextCompletedState },
			});
			// toaster.create({ title: "Record already exist" });
		} else {
			createHabitRecord({
				date: record.date,
				habit_id: record.habit_id,
				completed: nextCompletedState,
				// id: habitRecord[0].$id,
				// vars: { completed: nextCompletedState },
			});
			toaster.create({ title: "Record not found" });
		}
		console.log({ habitRecord });
	};

	return (
		<Button
			key={record.$id}
			w={"30px"}
			h={"30px"}
			bg={completed ? "primary" : "surface_container_highest"}
			borderRadius={"md"}
			position={"relative"}
			justifyContent={"center"}
			alignItems={"center"}
			onClick={onHabitRecordClick}
		>
			<Text
				color={"subtext2"}
				position={showDay === "inside" ? "initial" : "absolute"}
				top={"-30px"}
				left={"6px"}
			>
				{dayjs(record.date).date()}
			</Text>
		</Button>
	);
};
