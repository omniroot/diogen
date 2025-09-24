import { Progress, Text, VStack } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import { Link } from "@tanstack/react-router";
import type { FC } from "react";
import type { IModule } from "@/api/supabase.interface.ts";

interface IModuleItemProps {
	module: IModule;
}

function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min)) + min;
}

export const ModuleItem: FC<IModuleItemProps> = ({ module }) => {
	const { setNodeRef } = useDroppable({
		id: `module-droppable-${module.id}`,
		data: { module_id: module.id },
	});

	// const {} = useGetProject({variables: {custom_id}});
	return (
		<VStack
			w={"150px"}
			bg={{
				_hover: "hover",
			}}
			border={"2px solid {colors.outline}"}
			asChild
			p="8px"
			borderRadius={"12px"}
			ref={setNodeRef}
		>
			<Link to="/modules/$module_id" params={{ module_id: String(module.id) }}>
				<Text color="text" fontSize={"lg"}>
					{module.title}
				</Text>
				<Progress.Root defaultValue={getRandomInt(10, 100)} minW="70%">
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
		</VStack>
	);
};
