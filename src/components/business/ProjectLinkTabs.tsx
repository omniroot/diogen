import { HStack, Icon, Text } from "@chakra-ui/react";
import { IconAssembly, IconLayoutKanban, IconTable } from "@tabler/icons-react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { GanttIcon } from "@/assets/icons/gantt-icon.tsx";
import { useLocationStore } from "@/stores/location.store.tsx";

const getSelectedValue = (currentPath: string) => {
	const pathSegments = currentPath.split("/").filter(Boolean);
	return pathSegments.length < 3 ? "general" : pathSegments[pathSegments.length - 1];
};

export const ProjectLinkTabs = () => {
	const { custom_id } = useLocationStore();
	const navigate = useNavigate();
	const location = useLocation();
	const indicatorRef = useRef<HTMLDivElement>(null);

	const tabs = [
		{
			value: "general",
			name: "General",
			icon: <IconAssembly />,
			path: `/projects/${custom_id}/`,
		},
		{
			value: "kanban",
			name: "Kanban",
			icon: <IconLayoutKanban />,
			path: `/projects/${custom_id}/kanban`,
		},
		{
			value: "table",
			name: "Table",
			icon: <IconTable />,
			path: `/projects/${custom_id}/table`,
		},
		{
			value: "timeline",
			name: "Timeline",
			icon: <GanttIcon />,
			path: `/projects/${custom_id}/timeline`,
		},
	];

	const [active, setActive] = useState(getSelectedValue(location.pathname));

	console.log({ active });

	console.log({ active }, getSelectedValue(location.pathname));

	// useEffect(() => {

	// }, [active]);

	useEffect(() => {
		setActive(getSelectedValue(location.pathname));

		if (indicatorRef.current) {
			const [activeWidth, activeHeight, activeLeft] = [
				document.getElementById(`tab-${active}`)?.clientWidth,
				document.getElementById(`tab-${active}`)?.clientHeight,
				document.getElementById(`tab-${active}`)?.offsetLeft,
			];

			// console.log("useefect", { activeWidth, activeHeight, activeLeft });
			indicatorRef.current.style.width = `${activeWidth}px`;
			indicatorRef.current.style.height = `${activeHeight}px`;
			indicatorRef.current.style.left = `${activeLeft}px`;
		}
	}, [active, location]);

	return (
		<HStack
			w={"100%"}
			minH={"58px"}
			border="2px solid {colors.outline}"
			p={2}
			gap={1}
			borderRadius="md"
			overflowX={"scroll"}
			overflowY={"hidden"}
			position={"relative"}
		>
			<HStack
				position={"absolute"}
				// border={"2px solid red"}
				bg={"surface_container_highest"}
				borderRadius={"sm"}
				transition={"left 200ms, width 200ms"}
				ref={indicatorRef}
			/>
			{tabs.map((tab) => (
				<HStack
					id={`tab-${tab.value}`}
					key={tab.value}
					display="flex"
					alignItems="center"
					gap={2}
					px={3}
					py={2}
					borderRadius="sm"
					cursor="pointer"
					transition="background 200ms"
					// _hover={{ bg: "hover" }}
					onClick={() => {
						setActive(tab.value);
						navigate({ to: tab.path });
					}}
					_icon={{
						w: "18px",
						h: "18px",
					}}
				>
					<Icon zIndex={"1"}>{tab.icon}</Icon>
					<Text fontSize="sm" zIndex={"1"}>
						{tab.name}
					</Text>
				</HStack>
			))}
		</HStack>
	);
};
