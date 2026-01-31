import { Button, HStack, Text } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useDrawers } from "@/hooks/useDrawers";
// import { ResponsiveOverlay } from "@/components/ResponsiveOverlay.tsx";

export const Route = createFileRoute("/(app)/test")({
	component: RouteComponent,
});

function RouteComponent() {
	// const { open, setOpen } = useDisclosure();
	// const {
	// 	modals,
	// 	toggle: toggleHabits,
	// 	isOpen: habitsIsOpen,
	// 	isAnyOpen,
	// } = useDrawers("habits");
	const {
		drawers,
		toggle: toggleActivity,
		// isOpen: tasksIsOpen,
		isAnyOpen,
	} = useDrawers("activity");

	// const { domain, query } = useActivities({action: ""});
	// const { data: activities } = query.useList({});
	// const { data: activities } = domain.getUserActivities();
	// console.log({ activities });

	return (
		<div>
			<Text>isAnyOpen: {String(isAnyOpen)}</Text>
			<Button onClick={() => toggleActivity("create")}>Toggle create</Button>
			<Button onClick={() => toggleActivity("update")}>Toggle update</Button>
			<Button onClick={() => toggleActivity("delete")}>Toggle delete</Button>
			{drawers.map((d) => {
				return <HStack key={d.name}>{`${d.name} ${d.type}`}</HStack>;
			})}
			{/* <ResponsiveOverlay isOpen={open} onOpenChange={(o) => setOpen(o)}>
				23
			</ResponsiveOverlay>
			<ResponsiveOverlay isOpen={open} onOpenChange={(o) => setOpen(o)}>
				45
			</ResponsiveOverlay> */}
		</div>
	);
}
