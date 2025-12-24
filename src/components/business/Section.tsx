import { Flex, HStack, Text, VStack } from "@chakra-ui/react";

interface ISection {
	icon?: React.ReactNode;
	title?: string;
	infoSlot?: React.ReactNode;
	actionsSlot?: React.ReactNode;
	orientation?: "vertical" | "horizontal";
	children?: React.ReactNode;
}

export const Section: React.FC<ISection> = ({
	icon,
	title = "Title",
	infoSlot,
	actionsSlot,
	orientation = "vertical",
	children,
}) => {
	return (
		<VStack
			w={"100%"}
			alignItems={"start"}
			border={"2px solid {colors.outline}"}
			borderRadius={"md"}
		>
			<HStack
				w={"100%"}
				mb={"-10px"}
				justifyContent={"space-between"}
				alignItems={"center"}
				p={2}
			>
				<HStack>
					{icon}
					<Text fontSize={"lg"} fontWeight={"bold"}>
						{title}
					</Text>
					{infoSlot}
				</HStack>
				<HStack>{actionsSlot}</HStack>
			</HStack>
			<Flex
				w={"100%"}
				gap={0}
				alignItems={"start"}
				direction={orientation === "vertical" ? "column" : "row"}
			>
				{children}
			</Flex>
		</VStack>
	);
};
