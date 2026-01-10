import { Box, Skeleton } from "@chakra-ui/react";
import { useGetHabits } from "@/features/habits/api/habits.api";
import { HabitItem } from "@/features/habits/ui/HabitItem";
import { KaizenCard } from "@/theme/ui/KaizenCard.tsx";

export const HabitList = () => {
	// const { open } = useModals("issue");
	const { data: habits, isFetching } = useGetHabits({});
	// habits = habits?.concat(habits);
	// const [date] = useState(new Date());

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
			{/* <Section
				icon={<IconCopyCheck />}
				title="Habits"
				// actionsSlot={
				// 	<IconButton onClick={() => setHabitDrawerOpen(true)} variant="ghost">
				// 		<IconPlus />
				// 	</IconButton>
				// }
			> */}
			<KaizenCard.Root>
				<KaizenCard.Header>
					<KaizenCard.Title>Habits</KaizenCard.Title>
				</KaizenCard.Header>
				<KaizenCard.Body gap={2}>
					{habits?.map((habit, index) => {
						console.log("Render ", habit);

						return (
							<>
								<Skeleton key={habit.$id} loading={isFetching} w={"100%"}>
									<HabitItem habit={habit} />
									{/* <Separator w={"100%"} size={"md"} borderColor={"#363636"} px={4} /> */}
								</Skeleton>
								{index < habits.length - 1 && (
									<Box
										w={"95%"}
										h={"3px"}
										bg={"#363636"}
										mx={"10px"}
										borderRadius={"full"}
									/>
								)}
							</>
						);
					})}
				</KaizenCard.Body>
			</KaizenCard.Root>

			{/* </Section> */}
		</>
	);
};
