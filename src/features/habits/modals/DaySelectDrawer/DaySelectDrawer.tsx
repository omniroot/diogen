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
