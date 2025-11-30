import { IconButton, Skeleton, Text, VStack } from "@chakra-ui/react";
import { IconCopyCheck, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useGetHabits } from "@/api/queries/habits.api.ts";
import { Section } from "@/components/business/Section.tsx";
import { HabitItem } from "@/features/habits/components/HabitItem.tsx";
import { useHabitsStore } from "@/stores/habits.store.tsx";
import { useModals } from "@/stores/modals.store.tsx";

export const HabitList = () => {
	// const { open } = useModals("issue");
	const { setHabitDrawerOpen } = useHabitsStore();
	const { data: habits, isFetching } = useGetHabits({});
	const [date] = useState(new Date());

	// console.log({ issues, opts });

	return (
		<>
			{/* <HStack w={"100%"} justifyContent={"center"}>
				<Button
					variant={"ghost"}
					gap={"4px"}
					p={"12px 24px"}
					borderRadius={"full"}
					// onClick={() => setDaySelectOpen(true)}
				>
					<Text fontWeight={"bold"} fontSize={"18px"}>
						Today
					</Text>
					<IconChevronDown
						style={{
							// rotate: isDaySelectOpen ? "180deg" : "0deg",
							transition: "rotate 200ms",
						}}
					/>
				</Button>
			</HStack>
			<WeekPanel /> */}
			<Section
				icon={<IconCopyCheck />}
				title="Habits"
				actionsSlot={
					<IconButton onClick={() => setHabitDrawerOpen(true)} variant="ghost">
						<IconPlus />
					</IconButton>
				}
			>
				{habits?.map((habit) => {
					console.log("Render ", habit);

					return (
						<Skeleton key={habit.id} loading={isFetching} w={"100%"}>
							<HabitItem habit={habit} />
						</Skeleton>
					);
				})}
			</Section>
		</>
	);
};
