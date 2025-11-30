import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { IconCalendar } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
	useCreateDayRecord,
	useGetDayRecordByDate,
} from "@/api/queries/days_records.api.ts";
import { SleepWidget } from "@/features/habits/components/SleepWidget.tsx";
import { CreateHabitDrawer } from "@/features/habits/modals/CreateHabitDrawer/CreateHabitDrawer.tsx";
import { DaySelectDrawer } from "@/features/habits/modals/DaySelectDrawer/DaySelectDrawer.tsx";
import { useHabitsStore } from "@/stores/habits.store.tsx";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const { selectedDate, setDaySelectOpen } = useHabitsStore();
	// const { data: daysRecords } = useGetDaysRecords({});
	const {
		data: dayRecord,
		isFetched,
		refetch,
	} = useGetDayRecordByDate(
		{ date: dayjs(selectedDate).format("YYYY-MM-DD") },
		{ enabled: !!selectedDate },
	);
	const { mutate: createDayRecord } = useCreateDayRecord();

	console.log({ selectedDate });

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

	useEffect(() => {
		if (isFetched && !dayRecord) {
			console.log(selectedDate, "record not found!");

			createDayRecord(
				{
					date: dayjs(selectedDate).format("YYYY-MM-DD"),
				},
				{
					onSuccess: (data) => {
						refetch();
						console.log("Created dayRecord", data);
					},
				},
			);
		}
	}, [selectedDate, createDayRecord, isFetched, refetch, dayRecord]);

	const { mutate: updateToZero } = useMutation({
		mutationKey: ["update", "tozero"],
		mutationFn: async () => {},
	});

	return (
		<>
			<HStack
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
			</HStack>
			<HStack border={"2px solid {colors.primary}"} p={2} borderRadius={"md"}>
				{dayRecord?.date}
			</HStack>
			<SleepWidget />

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
			<DaySelectDrawer />
			<CreateHabitDrawer />
		</>
	);
}
