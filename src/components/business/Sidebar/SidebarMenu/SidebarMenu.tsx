import { HStack, Text, VStack } from "@chakra-ui/react";
import { IconHome, type ReactNode } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import type { FileRoutesByTo } from "~/.tanstack/routeTree.gen.ts";

interface IMenuList {
	icon: ReactNode;
	title: string;

	to: keyof FileRoutesByTo;
}

const menuList: IMenuList[] = [
	{ icon: <IconHome />, title: "Home", to: "/" },
	// { icon: <IconBlocks />, title: "Projects", to: "/projects" },
	// { icon: <IconCalendarWeek />, title: "Calendar", to: "/" },
	// { icon: <IconChartAreaLine />, title: "Statistics", to: "/" },
];

export const SidebarMenus = () => {
	return (
		<VStack w={"100%"} alignItems={"start"} gap={"8px"}>
			<Text color={"subtext"}>Menu</Text>

			{menuList.map((item) => {
				return (
					<SidebarMenuItem
						key={item.title}
						icon={item.icon}
						title={item.title}
						to={item.to}
					/>
				);
			})}
		</VStack>
	);
};

const SidebarMenuItem = ({ icon, title, to }: IMenuList) => {
	return (
		<HStack
			w={"100%"}
			p={"8px 4px"}
			gap={"8px"}
			alignItems={"center"}
			transition={"background 200ms"}
			bg={{ _hover: "hover" }}
			borderRadius={"6px"}
			asChild
		>
			<Link to={to}>
				{icon}
				<Text>{title}</Text>
			</Link>
		</HStack>
	);
};
