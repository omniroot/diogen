import { HStack, Text, VStack } from "@chakra-ui/react";

interface ISection {
	icon?: React.ReactNode;
	title?: string;
	actionsSlot?: React.ReactNode;
	children?: React.ReactNode;
}

export const Section: React.FC<ISection> = ({ icon, title = "Title", actionsSlot, children }) => {
	return (
		<VStack w={"100%"} alignItems={"start"}>
			<HStack
				w={"100%"}
				justifyContent={"space-between"}
				p={2}
				border={"2px solid {colors.outline}"}
				borderRadius={"md"}
			>
				<HStack>
					{icon}
					<Text fontSize={"lg"} fontWeight={"bold"}>
						{title}
					</Text>
				</HStack>
				<HStack>{actionsSlot}</HStack>
			</HStack>
			<VStack w={"100%"} alignItems={"start"}>
				{children}
			</VStack>
		</VStack>
		// <HStack  justifyContent={"space-between"} p={2}>
		// </HStack>
	);
};
