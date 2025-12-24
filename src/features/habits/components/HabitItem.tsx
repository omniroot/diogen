import {
	Button,
	CloseButton,
	Drawer,
	HStack,
	Portal,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Query } from "appwrite";
import dayjs from "dayjs";
import type { FC } from "react";
import type { Habits, HabitsRecords } from "@/api/types/appwrite.js";
import { HabitRecordItem } from "@/features/habits/components/HabitRecordItem.tsx";
import { useHabitsRecords } from "@/features/habits/controllers/useHabitsRecords.tsx";
import { useHabitsStore } from "@/stores/habits.store.tsx";
import { EmojiPicker } from "@/theme/components/EmojiPicker.tsx";
import { ddate } from "@/utils/ddate.ts";
import { generateUniqueId } from "@/utils/generateRandomId.tsx";

const normalizeRecords = (
	records: HabitsRecords[],
	length = 10,
	fromDate: null | string = null,
): HabitsRecords[] => {
	const map = new Map<string, HabitsRecords>();

	// кладём все записи в map по дате (YYYY-MM-DD)
	records.forEach((r) => {
		const key = dayjs(r.date).format("YYYY-MM-DD");
		map.set(key, r);
	});

	const result: HabitsRecords[] = [];

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

interface IProps {
	habit: Habits;
}

export const HabitItem: FC<IProps> = ({ habit }) => {
	const { selectedDate } = useHabitsStore();
	// const { data: habitRecord } = useGetHabitRecords({
	// 	habit_id: habit.id,
	// 	date: selectedDate.toISOString().split("T")[0],
	// });
	// const { mutate: createHabitRecord } = useCreateHabitRecord();
	// const { mutate: updateHabitRecord } = useUpdateHabitRecord();
	const { records } = useHabitsRecords({ habit_id: habit.$id });
	// const [checked, setChecked] = useState(false);

	// console.log({ bd: habitRecord?.[0]?.completed, state: checked });

	// useEffect(() => {
	// 	setChecked(habitRecord?.[0]?.completed || false);
	// }, [habitRecord]);

	// const hasRecord = habitRecord?.[0] || false;
	// const onChecked = (newValue: boolean) => {
	// 	if (!hasRecord) {
	// 		createHabitRecord({
	// 			habit_id: habit.id,
	// 			completed: newValue,
	// 			date: selectedDate.toISOString().split("T")[0],
	// 		});
	// 	} else {
	// 		updateHabitRecord({
	// 			ids: habitRecord?.[0].id || -999999999999,
	// 			data: {
	// 				// habit_id: habit.id,
	// 				completed: newValue,
	// 				// date: selectedDate.toISOString().split("T")[0],
	// 			},
	// 		});
	// 	}
	// 	setChecked(newValue);
	// };

	// console.log("@tds", selectedDate.toISOString().split("T")[0]);

	Query.overlaps;

	// const onChecked = (a: any) => {};

	return (
		<Drawer.Root placement={"bottom"}>
			<Drawer.Trigger asChild>
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
					<HStack key={ddate.getDate(selectedDate)}>
						{records &&
							normalizeRecords(records, 5, ddate.getDate(selectedDate)).map((record) => {
								return (
									<HabitRecordItem key={record.$id} record={record} showDay="upper" />
								);
							})}
					</HStack>
				</HStack>
			</Drawer.Trigger>
			<Portal>
				<Drawer.Backdrop />
				<Drawer.Positioner>
					<Drawer.Content>
						<Drawer.Header>
							<Drawer.Title>{habit.title}</Drawer.Title>
						</Drawer.Header>
						<Drawer.Body py={10} display={"flex"} justifyContent={"center"}>
							<VStack
								w={"fit-content"}
								h={"280px"}
								flexWrap={"wrap"}
								alignItems={"end"}
								// gap={1}
							>
								{records &&
									normalizeRecords(records, 100).map((record) => {
										return (
											<HabitRecordItem
												key={record.$id}
												record={record}
												showDay={"inside"}
											/>
											// <Box
											// 	key={record.$id}
											// 	w={"30px"}
											// 	h={"30px"}
											// 	display={"flex"}
											// 	justifyContent={"center"}
											// 	alignItems={"center"}
											// 	bg={record.completed ? "primary" : "surface_container_highest"}
											// 	borderRadius={"md"}
											// 	position={"relative"}
											// 	// overflow={"auto"}
											// >
											// 	<Text
											// 		color={"subtext2"}
											// 		// position={"absolute"}
											// 		// top={"-30px"}
											// 		// left={"6px"}
											// 	>
											// 		{dayjs(record.date).date()}
											// 	</Text>
											// </Box>
										);
									})}
							</VStack>
						</Drawer.Body>
						<Drawer.Footer>
							<Drawer.ActionTrigger asChild>
								<Button variant="outline">Cancel</Button>
							</Drawer.ActionTrigger>
							<Button>Save</Button>
						</Drawer.Footer>
						<Drawer.CloseTrigger asChild>
							<CloseButton size="sm" />
						</Drawer.CloseTrigger>
					</Drawer.Content>
				</Drawer.Positioner>
			</Portal>
		</Drawer.Root>
	);
};
