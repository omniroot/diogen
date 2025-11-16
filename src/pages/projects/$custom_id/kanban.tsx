import { Badge, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { FC, ReactNode } from "react";
import { refetchQuery } from "@/api/api.ts";
import { getIssuesOptions, updateIssueOptions } from "@/api/queries/issues.api.ts";
import type { IIssue } from "@/api/supabase.ts";
import { useLocationStore } from "@/stores/location.store.tsx";
import { upperFirstLetter } from "@/utils/upperFirstLetter.tsx";

export const Route = createFileRoute("/projects/$custom_id/kanban")({
	component: RouteComponent,
});

function RouteComponent() {
	const { mutate: updateIssue } = useMutation(updateIssueOptions());
	return (
		<>
			{/* <dndco */}
			<DragDropProvider
				onDragEnd={(e) => {
					if (e.canceled) return;
					const { target, source } = e.operation;
					console.log(source?.data.id, " to ", target?.data.status);
					updateIssue(
						{ id: source?.data.id, status: target?.data.status },
						{
							onSuccess: () => {
								refetchQuery(["get", "issues"]);
							},
						},
					);
				}}
			>
				{/* <DragOverlay modifiers={[restrictToWindowEdges]}> */}
				<HStack
					w="100%"
					h={"90%"}
					justifyContent={"space-between"}
					alignItems={"start"}
					overflow={"scroll"}
				>
					<Column status={"backlog"} />
					<Column status={"todo"} />
					<Column status={"progress"} />
					<Column status={"done"} />
				</HStack>
				{/* </DragOverlay> */}
			</DragDropProvider>
			{/* this is a kanban for tasks123 */}
		</>
	);
}

interface ColumnProps {
	status: IIssue["status"];
	children?: ReactNode;
}

const Column: FC<ColumnProps> = ({ status, children }) => {
	const { project_id } = useLocationStore();
	const { ref } = useDroppable({
		id: `droppable-${status}`,

		data: {
			status,
		},
	});
	const { data: issues } = useQuery(getIssuesOptions({ status, project_id }));
	const elements = [];
	for (let i = 0; i < 100; i++) {
		elements.push(i);
	}

	return (
		<VStack
			w={"100%"}
			h="100%"
			p={2}
			alignItems={"start"}
			border={"2px solid {colors.outline}"}
			overflow={"scroll"}
			borderRadius={"md"}
			ref={ref}
		>
			<HStack w="100%" fontSize={"lg"} fontWeight={"regular"}>
				{upperFirstLetter(status)}
				<Badge bg={"surface_container_highest"} px={2} py={0} borderRadius={"full"}>
					{issues?.length}
				</Badge>
			</HStack>
			<Separator w={"100%"} />
			{children}
			{issues?.map((issue) => {
				return <KanbanIssue key={issue.id} issue={issue} />;
			})}
		</VStack>
	);
};

interface KanbanIssue {
	issue?: IIssue;
	children?: ReactNode;
}

const KanbanIssue: FC<KanbanIssue> = ({ issue, children }) => {
	const { ref } = useDraggable({
		id: `draggable-${issue?.id}`,

		data: {
			id: issue?.id,
		},
	});

	// const style = {
	// 	transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
	// };

	return (
		<VStack
			w={"100%"}
			p={2}
			alignItems={"start"}
			bg={""}
			border={"2px solid {colors.outline}"}
			borderRadius={"sm"}
			ref={ref}
			// style={style}
			// {...listeners}
			// {...attributes}
			zIndex={1}
		>
			{children}
			<HStack w={"100%"}>
				<Badge>{issue?.custom_id}</Badge>
			</HStack>
			<HStack w={"100%"}>
				<Text fontWeight={"bold"}>{issue?.title}</Text>
			</HStack>
			<HStack w={"100%"}>{issue?.custom_id}</HStack>
		</VStack>
	);
};
