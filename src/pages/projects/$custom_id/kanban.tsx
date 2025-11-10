import { HStack, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$custom_id/kanban")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			{/* this is a kanban for tasks123 */}
			<HStack w="100%" h={"90%"} justifyContent={"space-between"} alignItems={"start"} overflow={"scroll"}>
				<Column name="Todo" />
				<Column name="Do" />
				<Column name="Done" />
			</HStack>
		</>
	);
}

const Column = ({ name = "Name" }) => {
	const elements = [];
	for (let i = 0; i < 100; i++) {
		elements.push(i);
	}
	return (
		<VStack w={"100%"} h="100%" border={"2px solid {colors.outline}"} overflow={"scroll"} borderRadius={"md"}>
			<HStack>{name}</HStack>
			{elements.map((a) => (
				<HStack key={a}>{a}</HStack>
			))}
			content
		</VStack>
	);
};
