import { Collapsible, HStack, Icon, Text, useDisclosure } from "@chakra-ui/react";
import { IconChevronRight } from "@tabler/icons-react";
import { useHover } from "@uidotdev/usehooks";
import type { FC, ReactNode } from "react";

interface ISidebarSection {
	title?: string;
	action?: ReactNode;
	children?: ReactNode;
	defaultOpen?: boolean;
}

export const SidebarSection: FC<ISidebarSection> = ({
	title,
	action,
	children,
	defaultOpen = false,
}) => {
	const { open, onToggle } = useDisclosure({
		defaultOpen,
	});
	const [hoverRef, isHovered] = useHover();

	return (
		<Collapsible.Root
			w={"100%"}
			// h={"200px"}
			open={open}
			overflowY={"scroll"}
			onOpenChange={onToggle}
		>
			<Collapsible.Trigger asChild>
				<HStack
					w={"100%"}
					justifyContent={"space-between"}
					alignItems={"center"}
					px={"0.5"}
					py={"0.5"}
					gap={"2"}
					borderRadius={"sm"}
					userSelect={"none"}
					cursor={"pointer"}
					// bg={{ _hover: "hover" }}

					transition={"color 200ms, background 200ms"}
					ref={hoverRef}
				>
					<HStack alignItems={"center"}>
						<Text
							color={isHovered ? "text" : "subtext"}
							fontSize={"sm"}
							transition={"color 200ms"}
						>
							{title}
						</Text>
						<Icon
							color={isHovered ? "text" : "subtext"}
							size={"xs"}
							rotate={open ? "90deg" : "0deg"}
							transition={"color 200ms, rotate 200ms"}
						>
							<IconChevronRight />
						</Icon>
					</HStack>
					<HStack
						alignItems={"center"}
						opacity={isHovered ? 1 : 0}
						transition={"opacity 200ms"}
						onClick={(e) => e.stopPropagation()}
					>
						{action}
					</HStack>
				</HStack>
			</Collapsible.Trigger>
			<Collapsible.Content ml={"1"}>{children}</Collapsible.Content>
		</Collapsible.Root>
		// <HStack
		//   w={"100%"}
		//   px={"1"}
		//   py={"2"}
		//   gap={"2"}
		//   alignItems={"center"}
		//   transition={"background 200ms"}
		//   bg={{ _hover: "hover" }}
		//   borderRadius={"md"}
		//   asChild
		// >
		//   <Link to={to || "/"}>
		//     {icon}
		//     <Text>{title}</Text>
		//   </Link>
		// </HStack>
	);
};
