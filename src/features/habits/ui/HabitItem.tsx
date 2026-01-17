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
import type { FC } from "react";
import type { Habits } from "@/api/types/appwrite.d.ts";
import { EmojiPicker } from "@/theme/components/EmojiPicker.tsx";
import { ddate } from "@/utils/ddate.ts";

interface IProps {
	habit: Habits;
}

export const HabitItem: FC<IProps> = ({ habit }) => {
	const selectedDate = "2025-12-28";
	// const { selectedDate } = useHabitsStore();
	// const { data: habitRecord } = useGetHabitRecords({
	// 	habit_id: habit.id,
	// 	date: selectedDate.toISOString().split("T")[0],
	// });
	// const { mutate: createHabitRecord } = useCreateHabitRecord();
	// const { mutate: updateHabitRecord } = useUpdateHabitRecord();
	// const { records } = useHabitsRecords({ habit_id: habit.$id });
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
					// p={2}
					border={"1px solid transparent"}
					bg={"surface-container-high"}
					borderRadius={"2xl"}
				>
					<HStack>
						<EmojiPicker initialEmoji={String(habit.icon)} onlyPreview />
						<Text>{habit.title}</Text>
					</HStack>
					<HStack key={ddate.getDate(selectedDate)}>
						{/* {records &&
							normalizeRecords(records, 5, ddate.getDate(selectedDate)).map((record) => {
								return (
									<HabitRecordItem key={record.$id} record={record} showDay="upper" />
								);
							})} */}
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
								{/* {records &&
									normalizeRecords(records, 100).map((record) => {
										return (
											<HabitRecordItem
												key={record.$id}
												record={record}
												showDay={"inside"}
											/>
										);
									})} */}
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
