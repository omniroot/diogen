import { Button, HStack, IconButton, SimpleGrid, Spacer, Text } from "@chakra-ui/react";
import { IconChevronLeft, IconChevronRight, IconRestore } from "@tabler/icons-react";
import { useState } from "react";
import { UniversalModal } from "@/components/ResponsiveOverlay.tsx";
import { useApp } from "@/hooks/useApp.tsx";
import { useDrawers } from "@/hooks/useDrawers";
import { ddate } from "@/utils/ddate.ts";
import { upperFirstLetter } from "@/utils/upperFirstLetter.tsx";

type Props = { a?: null };
export const DaySelectModal: React.FC<Props> = () => {
	const { selectedDate, setSelectedDate } = useApp();
	const selectedDateOBJ = new Date(selectedDate);
	const { toggle, isOpen } = useDrawers("day-select");
	console.log({ isOpen });

	const [currentMonth, setCurrentMonth] = useState(selectedDateOBJ.getMonth());
	const [currentYear, setCurrentYear] = useState(selectedDateOBJ.getFullYear());
	const [currentDay, setCurrentDay] = useState(selectedDateOBJ.getDate());

	const handlePrevMonth = () => {
		if (currentMonth === 0) {
			setCurrentMonth(11);
			setCurrentYear(currentYear - 1);
		} else {
			setCurrentMonth(currentMonth - 1);
		}
	};

	const handleNextMonth = () => {
		if (currentMonth === 11) {
			setCurrentMonth(0);
			setCurrentYear(currentYear + 1);
		} else {
			setCurrentMonth(currentMonth + 1);
		}
	};

	const getDaysInMonth = (month: number, year: number) => {
		return new Date(year, month + 1, 0).getDate();
	};

	const renderDays = () => {
		const days = [];
		const numDays = getDaysInMonth(currentMonth, currentYear);
		for (let i = 1; i <= numDays; i++) {
			const isToday = i === currentDay && selectedDateOBJ.getMonth() === currentMonth;
			days.push(
				<Button
					key={`${currentYear}${currentMonth}${i}`}
					w={"50px"}
					h={"50px"}
					border={"none"}
					borderRadius={"16px"}
					color={isToday ? "on-primary" : "on-surface"}
					bg={isToday ? "primary" : "surface-container-high"}
					onClick={() => {
						const nextDate = new Date(currentYear, currentMonth, i);
						nextDate.setHours(0, 0, 0, 0);
						setSelectedDate(ddate.getDate(nextDate));
						setCurrentMonth(nextDate.getMonth());
						setCurrentYear(nextDate.getFullYear());
						setCurrentDay(nextDate.getDate());
						// setDaySelectOpen(false);
					}}
				>
					{i}
				</Button>,
			);
		}
		return days;
	};

	const resetToToday = () => {
		const today = new Date();

		setSelectedDate(ddate.getDate(today));
		setCurrentMonth(today.getMonth());
		setCurrentYear(today.getFullYear());
		setCurrentDay(today.getDate());
	};

	return (
		<UniversalModal open={isOpen} onOpenChange={() => toggle("view")} title="Day select">
			<HStack
				w={"100%"}
				py={2}
				bg="surface_container"
				borderRadius={"full"}
				justifyContent={"space-between"}
			>
				<IconButton variant={"ghost"} onClick={handlePrevMonth}>
					<IconChevronLeft />
				</IconButton>
				<Text fontSize={"lg"} fontWeight={"bold"}>
					{/* {upperFirstLetter(selectedMonth)} */}
					{upperFirstLetter(
						new Date(currentYear, currentMonth).toLocaleString("ru-RU", {
							month: "long",
						}),
					)}{" "}
					{currentYear}
				</Text>
				<IconButton variant={"ghost"} onClick={handleNextMonth}>
					<IconChevronRight />
				</IconButton>
			</HStack>
			<Spacer h={5} />

			<SimpleGrid
				w={"100%"}
				columns={7}
				gap={8}
				py={2}
				// px={4}
				color={"subtext"}
				fontSize={"md"}
				textWrap={"nowrap"}
				justifyContent={"space-between"}
			>
				<Text>Mon</Text>
				<Text>Tue</Text>
				<Text>Wed</Text>
				<Text>Thu</Text>
				<Text>Fri</Text>
				<Text>Sat</Text>
				<Text>Sun</Text>
			</SimpleGrid>
			<SimpleGrid columns={7} gap={"15px"} py={2}>
				{renderDays()}
			</SimpleGrid>
			<Spacer h={5} />
			<Button
				w={"100%"}
				py={6}
				variant={"primary"}
				borderRadius={"full"}
				onClick={() => {
					resetToToday();
				}}
			>
				<IconRestore /> Reset to today
			</Button>
		</UniversalModal>
	);
};
