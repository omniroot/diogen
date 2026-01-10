// import {
// 	Button,
// 	CloseButton,
// 	Drawer,
// 	HStack,
// 	IconButton,
// 	Portal,
// 	SimpleGrid,
// 	Spacer,
// 	Text,
// } from "@chakra-ui/react";
// import { IconChevronLeft, IconChevronRight, IconRestore } from "@tabler/icons-react";
// import { useState } from "react";
// // import { useHabitsStore } from "@/stores/habits.store.tsx";
// import { upperFirstLetter } from "@/utils/upperFirstLetter.tsx";

// export const DaySelectDrawer = () => {
// 	const { selectedDate, setSelectedDate, isDaySelectOpen, setDaySelectOpen } =
// 		useHabitsStore();

// 	const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
// 	const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
// 	const [currentDay, setCurrentDay] = useState(selectedDate.getDate());

// 	const handlePrevMonth = () => {
// 		if (currentMonth === 0) {
// 			setCurrentMonth(11);
// 			setCurrentYear(currentYear - 1);
// 		} else {
// 			setCurrentMonth(currentMonth - 1);
// 		}
// 	};

// 	const handleNextMonth = () => {
// 		if (currentMonth === 11) {
// 			setCurrentMonth(0);
// 			setCurrentYear(currentYear + 1);
// 		} else {
// 			setCurrentMonth(currentMonth + 1);
// 		}
// 	};

// 	const getDaysInMonth = (month: number, year: number) => {
// 		return new Date(year, month + 1, 0).getDate();
// 	};

// 	const renderDays = () => {
// 		const days = [];
// 		const numDays = getDaysInMonth(currentMonth, currentYear);
// 		for (let i = 1; i <= numDays; i++) {
// 			const isToday = i === currentDay && selectedDate.getMonth() === currentMonth;
// 			days.push(
// 				<Button
// 					key={`${currentYear}${currentMonth}${i}`}
// 					w={"50px"}
// 					h={"50px"}
// 					border={"none"}
// 					borderRadius={"16px"}
// 					bg={isToday ? "primary" : "surface_container_highest"}
// 					onClick={() => {
// 						const nextDate = new Date(currentYear, currentMonth, i);
// 						nextDate.setHours(0, 0, 0, 0);
// 						setSelectedDate(nextDate);
// 						setCurrentMonth(nextDate.getMonth());
// 						setCurrentYear(nextDate.getFullYear());
// 						setCurrentDay(nextDate.getDate());
// 						// setDaySelectOpen(false);
// 					}}
// 				>
// 					{i}
// 				</Button>,
// 			);
// 		}
// 		return days;
// 	};

// 	const resetToToday = () => {
// 		const today = new Date();

// 		setSelectedDate(today);
// 		setCurrentMonth(today.getMonth());
// 		setCurrentYear(today.getFullYear());
// 		setCurrentDay(today.getDate());
// 	};

// 	return (
// 		<Drawer.Root
// 			placement={"top"}
// 			open={isDaySelectOpen}
// 			onOpenChange={(e) => setDaySelectOpen(e.open)}
// 		>
// 			<Portal>
// 				<Drawer.Backdrop />
// 				<Drawer.Positioner>
// 					<Drawer.Content
// 						bg={"surface_container"}
// 						borderRadius={"24px"}
// 						boxShadow={"none"}
// 					>
// 						<Drawer.Header justifyContent={"center"}>
// 							<Text fontSize={"lg"} fontWeight={"bold"}>
// 								Create
// 							</Text>
// 							<Drawer.CloseTrigger asChild>
// 								<CloseButton />
// 							</Drawer.CloseTrigger>
// 						</Drawer.Header>
// 						<Drawer.Body>
// 							<HStack
// 								w={"100%"}
// 								py={2}
// 								bg="surface_container"
// 								borderRadius={"full"}
// 								justifyContent={"space-between"}
// 							>
// 								<IconButton variant={"ghost"} onClick={handlePrevMonth}>
// 									<IconChevronLeft />
// 								</IconButton>
// 								<Text fontSize={"lg"} fontWeight={"bold"}>
// 									{/* {upperFirstLetter(selectedMonth)} */}
// 									{upperFirstLetter(
// 										new Date(currentYear, currentMonth).toLocaleString("ru-RU", {
// 											month: "long",
// 										}),
// 									)}{" "}
// 									{currentYear}
// 								</Text>
// 								<IconButton variant={"ghost"} onClick={handleNextMonth}>
// 									<IconChevronRight />
// 								</IconButton>
// 							</HStack>
// 							<Spacer h={5} />

// 							<SimpleGrid
// 								w={"100%"}
// 								columns={7}
// 								gap={8}
// 								py={2}
// 								// px={4}
// 								color={"subtext"}
// 								fontSize={"md"}
// 								textWrap={"nowrap"}
// 								justifyContent={"space-between"}
// 							>
// 								<Text>Mon</Text>
// 								<Text>Tue</Text>
// 								<Text>Wed</Text>
// 								<Text>Thu</Text>
// 								<Text>Fri</Text>
// 								<Text>Sat</Text>
// 								<Text>Sun</Text>
// 							</SimpleGrid>
// 							<SimpleGrid columns={7} gap={"15px"} py={2}>
// 								{renderDays()}
// 							</SimpleGrid>
// 							<Spacer h={5} />
// 							<Button
// 								w={"100%"}
// 								py={6}
// 								variant={"primary"}
// 								borderRadius={"full"}
// 								onClick={() => {
// 									resetToToday();
// 								}}
// 							>
// 								<IconRestore /> Reset to today
// 							</Button>
// 							{/* <HStack>
// 								или grid для отображения кнпоок с днями (1,2,3,4 и т.д){" "}
// 							</HStack> */}
// 						</Drawer.Body>
// 					</Drawer.Content>
// 				</Drawer.Positioner>
// 			</Portal>
// 		</Drawer.Root>
// 	);
// };
