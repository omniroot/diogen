// import { IconButton } from "@/components/ui/IconButton.tsx";
import { HStack } from "@chakra-ui/react";

export const SidebarActions = () => {
	return (
		<HStack
			w="100%"
			// p="8px 6px"
			justifyContent={"space-between"}
			alignItems={"center"}
		>
			<HStack gap={"8px"} alignItems={"center"}></HStack>
		</HStack>
	);
};
