import {
	Box,
	Button,
	Heading,
	HStack,
	Icon,
	IconButton,
	Text,
	VStack,
} from "@chakra-ui/react";
import { IconCalendar, IconChevronDown, IconRefresh } from "@tabler/icons-react";
import { useActivities } from "@/features/activities/api/activities.api.ts";
import {
	refetchActivityEntries,
	useActivityEntries,
} from "@/features/activities/api/activity-entries.api.ts";
import { useJournal } from "@/features/journal/api/journal-entries.api.ts";
import { useApp } from "@/hooks/useApp.tsx";
import { useDrawers } from "@/hooks/useDrawers";
import { ddate } from "@/utils/ddate.ts";

export const HelloSection = () => {
	const { selectedDate } = useApp();
	const displayDate = ddate.getRelativeLabel(selectedDate);
	const displayFullNiceDate = ddate.getFullNiceDate(selectedDate);
	const { activities, raw: activitiesRaw } = useActivities({ type: "list" });
	const { activityEntries } = useActivityEntries({ date: { equal: selectedDate } });
	const { journalEntries } = useJournal({
		type: "list",
		queries: { date: { equal: selectedDate } },
	});

	// const {} = activityEntri

	const completedActivitiesCount = activityEntries?.filter((a) => a.completed).length;

	const { toggle: toggleDaySelectDrawer } = useDrawers("day-select");

	const onRefreshClick = () => {
		activitiesRaw.refetch.list();
		refetchActivityEntries.list({});
	};

	return (
		<VStack alignItems={"start"} gap={"5px"} py={2}>
			<HStack w={"100%"} justifyContent={"space-between"}>
				<Heading fontSize={"18px"}>{displayDate}</Heading>
				<IconButton borderRadius={"full"} variant={"surface"} onClick={onRefreshClick}>
					<IconRefresh />
				</IconButton>
			</HStack>
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
					<Box w={"5px"} h={"5px"} bg={"primary"} borderRadius={"50%"} />{" "}
					{completedActivitiesCount} / {activities?.length} activities
				</HStack>
				<HStack fontSize={"16px"}>
					<Box w={"5px"} h={"5px"} bg={"outline"} borderRadius={"50%"} />{" "}
					{journalEntries?.length} notes
				</HStack>
			</HStack>
		</VStack>
	);
};
