import { Box, Button, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { IconCalendar, IconChevronDown, IconPlus } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { ChartTest } from "@/components/ChartTest.tsx";
import { ActivityDrawer } from "@/features/activities/modals/ActivityDrawer.tsx";
import { DaySelectModal } from "@/features/activities/modals/DaySelectModal.tsx";
import { ActivityList } from "@/features/activities/ui/ActivityList.tsx";
import { JournalDrawer } from "@/features/journal/ui/JournalDrawer.tsx";
import { JournalEntryList } from "@/features/journal/ui/JournalEntryList.tsx";
import { useApp } from "@/hooks/useApp.tsx";
import { useDrawers } from "@/hooks/useDrawers";
import { ddate } from "@/utils/ddate.ts";

export const Route = createFileRoute("/")({
	component: Index,
});

// interface HabitPlan {
// 	title: string;
// 	checked: boolean;
// 	children?: HabitPlan[];
// }

// const habitsPlan: HabitPlan[] = [
// 	{
// 		title: "Habits",
// 		checked: false,
// 		children: [
// 			{
// 				title: "HabitsList",
// 				checked: false,
// 			},
// 			{
// 				title: "HabitItem",
// 				checked: false,
// 			},
// 			{
// 				title: "Journal",
// 				checked: false,
// 			},
// 		],
// 	},
// ];

function Index() {
	const { selectedDate } = useApp();
	const displayDate = ddate.getRelativeLabel(selectedDate);
	const displayFullNiceDate = ddate.getFullNiceDate(selectedDate);
	// const { goals, isLoading } = useGoals({
	// 	parent_id: {
	// 		isNull: true,
	// 	},
	// });
	// const { habits, isLoading: hbl } = useHabits({});
	// const [tab, setTab] = useState("timeline");
	const { toggle: toggleDaySelectDrawer } = useDrawers("day-select");
	const { toggle: toggleActivityDrawer } = useDrawers("activity");
	const { toggle: toggleJournalDrawer } = useDrawers("journal");
	// const { selectedDate, setDaySelectOpen } = useHabitsStore();
	// const { data: daysRecords } = useGetDaysRecords({});
	// const {
	// 	data: dayRecord,
	// 	isFetched,
	// 	refetch,
	// } = useGetDayRecordByDate(
	// 	{ date: dayjs(selectedDate).format("YYYY-MM-DD") },

	// 	{ enabled: !!selectedDate },
	// );
	// const { mutate: createDayRecord } = useCreateDayRecord();

	// console.log({ selectedDate });

	// const { data: currentDayRecord } = useQuery({
	// 	queryKey: ["day", "record"],
	// 	queryFn: async () => {
	// 		const { rows } = await tablesDB.listRows<DaysRecords>({
	// 			databaseId: "6924e361002fab68a29c",
	// 			tableId: "days_records",

	// 			queries: [bySpecificDate(selectedDate.toISOString())],
	// 			// total: includeTotal,
	// 		});
	// 		return rows;
	// 	},
	// });

	// useEffect(() => {
	// 	if (isFetched && !dayRecord) {
	// 		console.log(selectedDate, "record not found!");

	// 		createDayRecord(
	// 			{
	// 				date: dayjs(selectedDate).format("YYYY-MM-DD"),
	// 			},
	// 			{
	// 				onSuccess: (data) => {
	// 					refetch();
	// 					console.log("Created dayRecord", data);
	// 				},
	// 			},
	// 		);
	// 	}
	// }, [selectedDate, createDayRecord, isFetched, refetch, dayRecord]);

	return (
		<>
			<VStack alignItems={"start"} gap={"5px"} py={2}>
				<Text fontSize={"18px"} fontWeight={"semibold"}>
					{displayDate}
				</Text>
				<Button
					h={"auto"}
					variant={"ghost"}
					alignItems={"center"}
					px={2}
					py={1}
					ml={"-3"}
					bg={{ _hover: "surface-container" }}
					borderRadius={"12px"}
					onClick={() => toggleDaySelectDrawer("view")}
				>
					<Icon w={"18px"} color={"primary"}>
						<IconCalendar />
					</Icon>
					<Text fontSize={"16px"} color={"on-surface-dark"}>
						{displayFullNiceDate}
					</Text>
					<Icon w={"18px"} color={"on-surface-dark"}>
						<IconChevronDown />
					</Icon>
				</Button>
				{/* <Spacer minH={"2"} /> */}
				<HStack gap={"10px"} color={"on-surface-dark"}>
					<HStack fontSize={"16px"}>
						<Box w={"5px"} h={"5px"} bg={"primary"} borderRadius={"50%"} /> 1/4 tasks
					</HStack>
					<HStack fontSize={"16px"}>
						<Box w={"5px"} h={"5px"} bg={"outline"} borderRadius={"50%"} /> 1 notes
					</HStack>
				</HStack>
			</VStack>
			<Text fontSize={"18px"} fontWeight={"bold"} color={"on-surface"}>
				Habits
			</Text>
			<ActivityList />
			<HStack w={"100%"} justifyContent={"end"}>
				<Button
					w={"fit-content"}
					color={"on-surface-dark"}
					bg={{ base: "surface-container", _hover: "surface-container-high" }}
					borderRadius={"full"}
					onClick={() => toggleActivityDrawer("create")}
				>
					<IconPlus />
					Create activity
				</Button>
			</HStack>
			<Text fontSize={"18px"} fontWeight={"bold"} color={"on-surface"}>
				Journal
			</Text>
			<JournalEntryList queries={{ date: { equal: selectedDate } }} />
			<HStack w={"100%"} justifyContent={"end"}>
				<Button
					w={"fit-content"}
					color={"on-surface-dark"}
					bg={{ base: "surface-container", _hover: "surface-container-high" }}
					borderRadius={"full"}
					onClick={() => toggleJournalDrawer("create")}
				>
					<IconPlus />
					Create journal
				</Button>
			</HStack>

			<ChartTest />

			<ActivityDrawer />
			<JournalDrawer />
			<DaySelectModal />
			{/* <HabitList /> */}
			{/* <KaizenCard.Root>
				<KaizenCard.Header>
					<VStack gap={"0"}>
						<KaizenCard.Title>Habits plan</KaizenCard.Title>
						<KaizenCard.Description>Description</KaizenCard.Description>
					</VStack>
				</KaizenCard.Header>
				<KaizenCard.Body>
					{habitsPlan.map((root) => {
						return (
							<>
								<Checkbox.Root key={root.title} checked={"indeterminate"}>
									<Checkbox.HiddenInput />
									<Checkbox.Control />
									<Checkbox.Label>{root.title}</Checkbox.Label>
								</Checkbox.Root>
								{root.children?.map((children) => {
									return (
										<Checkbox.Root key={children.title} checked={false} ml={6}>
											<Checkbox.HiddenInput />
											<Checkbox.Control />
											<Checkbox.Label>{children.title}</Checkbox.Label>
										</Checkbox.Root>
									);
								})}
							</>
						);
					})}
				</KaizenCard.Body>
				<KaizenCard.Footer justifyContent={"end"}>
					<IconButton
						color={"on-surface"}
						bg={"surface-container-high"}
						borderRadius={"full"}
					>
						<IconShare2 />
					</IconButton>
				</KaizenCard.Footer>
			</KaizenCard.Root> */}

			{/* <HStack
				w={"100%"}
				p={2}
				gap={1}
				justifyContent={"space-between"}
				alignItems={"start"}
				border={"2px solid {colors.outline}"}
				borderRadius={"md"}
			>
				<VStack h={"100%"} justifyContent={"center"}>
					<Text fontSize={"xl"} fontWeight={"bold"}>
						Overview
					</Text>
				</VStack>
				<HStack>
					<Button onClick={() => setDaySelectOpen(true)}>
						<IconCalendar />
						{selectedDate.toLocaleDateString("ru")}
					</Button>
				</HStack>
			</HStack> */}
			{/* <HabitList /> */}

			{/* <HStack border={"2px solid {colors.primary}"} p={2} borderRadius={"md"}>
				{dayRecord?.date}
			</HStack> */}
			{/* <SleepWidget /> */}

			{/* <VStack w={"100%"}>
				{daysRecords?.map((dayRecord) => (
					<VStack
						key={dayRecord.$id}
						w={"100%"}
						alignItems={"start"}
						border={"1px solid gray"}
						p={2}
					>
						{JSON.stringify(dayRecord, null, 4)
							.split(",")
							.map((ell) => {
								if (ell.includes("$")) return null;
								return <HStack key={ell}>{ell}</HStack>;
							})}
					</VStack>
				))}
			</VStack> */}
			{/* <HabitList /> */}
			{/* <DaySelectDrawer /> */}
			{/* <CreateHabitDrawer /> */}
		</>
	);
}
