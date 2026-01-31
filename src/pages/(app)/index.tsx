import { createFileRoute } from "@tanstack/react-router";
import { DaySelectModal } from "@/features/activities/modals/DaySelectModal.tsx";
import { ActivitiesSection } from "@/pages/(app)/-components/ActivitiesSection.tsx";
import { HelloSection } from "@/pages/(app)/-components/HelloSection";

export const Route = createFileRoute("/(app)/")({
	component: Index,
});

function Index() {
	return (
		<>
			<HelloSection />
			<ActivitiesSection />
			<DaySelectModal />

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
		</>
	);
}
