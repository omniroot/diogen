import { Box, Button, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { IconCalendar, IconChevronDown } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { DaySelectModal } from "@/features/activities/modals/DaySelectModal.tsx";
import { useApp } from "@/hooks/useApp.tsx";
import { useDrawers } from "@/hooks/useDrawers";
import { ddate } from "@/utils/ddate.ts";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	const { selectedDate } = useApp();
	const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
	const previousScrollY = useRef(0);
	const displayDate = ddate.getRelativeLabel(selectedDate);
	const displayFullNiceDate = ddate.getFullNiceDate(selectedDate);

	const { toggle: toggleDaySelectDrawer } = useDrawers("day-select");

	useEffect(() => {
		const container = document.getElementsByTagName("main")[0];

		const handleScroll = () => {
			const currentScrollY = container.scrollTop;

			if (currentScrollY > previousScrollY.current) {
				setScrollDirection("down");
			} else {
				setScrollDirection("up");
			}

			previousScrollY.current = currentScrollY;
		};

		container.addEventListener("scroll", handleScroll, { passive: true });
		return () => container.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<>
			<VStack
				alignItems={"start"}
				gap={"5px"}
				py={2}
				px={4}
				h={scrollDirection === "down" ? "0px" : "250px"}
				// overflow={"hidden"}
				transition={"height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease"}
				opacity={scrollDirection === "down" ? 0 : 1}
			>
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
			<Button
				onClick={() => setScrollDirection((prev) => (prev === "down" ? "up" : "down"))}
			>
				{String(scrollDirection)}
			</Button>

			{Array.from({ length: 5 }).map(() => {
				const id = Math.random().toString(36).substr(2, 9);
				return (
					<Box
						key={id}
						w={"100%"}
						p={4}
						bg={"surface-container"}
						borderRadius={"12px"}
						_hover={{ bg: "surface-container-high" }}
					>
						<Text fontWeight={"semibold"} mb={2}>
							Item
						</Text>
						<Text fontSize={"14px"} color={"on-surface-dark"}>
							Это тестовый контент для проверки скролла. Вам нужно скролить вниз, чтобы
							увидеть эффект анимации заголовка и плавающей панели.
						</Text>
					</Box>
				);
			})}
			<VStack w={"100%"} h={"500px"} bg={"surface-container"} borderRadius={"21px"}>
				Это движущийся контект, он должен перекрывать все что выше при скроле вниз
			</VStack>
			{/* <Text fontSize={"18px"} fontWeight={"bold"} color={"on-surface"}>
				Habits
			</Text>
			<ActivityList /> */}
			{/* <HStack w={"100%"} justifyContent={"end"}>
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
			</HStack> */}
			{/* <Text fontSize={"18px"} fontWeight={"bold"} color={"on-surface"}>
				Journal
			</Text>
			<JournalEntryList queries={{ date: { equal: selectedDate } }} /> */}
			{/* <HStack w={"100%"} justifyContent={"end"}>
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
			</HStack> */}
			{/* <ActivityDrawer /> */}
			{/* <JournalDrawer /> */}
			<DaySelectModal />
		</>
	);
}
