import { HStack, Icon, Text } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import type { routeTypes } from "@/router.tsx";
import { Link } from "@tanstack/react-router";

interface ISidebarItem {
	icon?: ReactNode;
	title?: string;
	custom_id?: string;
	to?: keyof typeof routeTypes;
}

export const SidebarItem: FC<ISidebarItem> = ({ icon, title, custom_id, to }) => {
	return (
		<HStack
			w={"100%"}
			px={"1"}
			py={"2"}
			gap={"2"}
			alignItems={"center"}
			transition={"background 200ms"}
			bg={{ _hover: "hover" }}
			borderRadius={"md"}
			asChild
		>
			<Link to={to || "/"} params={{ custom_id }}>
				<Icon color={"subtext"} size={"sm"}>
					{icon}
				</Icon>
				<Text fontSize={"sm"}>{title}</Text>
			</Link>
		</HStack>
	);
};
