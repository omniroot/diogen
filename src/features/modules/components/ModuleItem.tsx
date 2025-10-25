import { HStack, Progress, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { Link } from "@tanstack/react-router";
import type { FC } from "react";
import type { IModule } from "@/api/supabase.ts";
import { useLocationStore } from "@/stores/location.store.tsx";

interface IModuleItemProps {
	module: IModule;
}

function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min;
}

export const ModuleItem: FC<IModuleItemProps> = ({ module }) => {
	const { custom_id } = useLocationStore();
	const { setNodeRef } = useDroppable({
		id: `module-droppable-${module.id}`,
		data: { module_id: module.id },
	});

	// const {} = useGetProject({variables: {custom_id}});
	return (
		<HStack
			w={"100%"}
			bg={{
				_hover: "hover",
			}}
			// border={"2px solid {colors.outline}"}
			asChild
			p="8px"
			borderRadius={"12px"}
			ref={setNodeRef}
		>
			<Link
				to="/projects/$custom_id/modules/$module_id"
				params={{ custom_id: String(custom_id), module_id: String(module.id) }}
			>
				<Text color="text" fontSize={"lg"}>
					{module.title}
				</Text>
				<Progress.Root w={"100%"} defaultValue={getRandomInt(10, 100)} minW="70%">
					{/* <Progress.Label>Usage</Progress.Label> */}
					<Progress.Track flex="1" bg={"surface_container_highest"} rounded={"md"}>
						<Progress.Range bg={"primary"} />
					</Progress.Track>
					{/* <Progress.ValueText>40%</Progress.ValueText> */}
				</Progress.Root>
				<Text color="text_variant" fontSize={"md"}>
					{module.status}
				</Text>
			</Link>
		</HStack>
	);
};
