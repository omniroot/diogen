import { Menu, Portal, VStack } from "@chakra-ui/react";
import { IconChevronRight } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { keyFactory, refetchQuery } from "@/api/api.ts";
import { deleteIssuesOptions } from "@/api/queries/issues.api.ts";
import { getModulesOptions } from "@/api/queries/modules.api.ts";
import { useGetProjects } from "@/api/queries/projects.api.ts";
import type { IIssue } from "@/api/supabase.ts";
import { toaster } from "@/theme/components/toaster.tsx";

// import { toaster } from "@/components/ui/toaster.tsx";

const getGitCommitName = (issue?: IIssue) => {
	return `${issue?.custom_id}-${issue?.title.toLowerCase().replaceAll(" ", "-")}`;
};

// interface IItem {
// 	title: string;
// 	value: string;
// 	color: string;
// }

// const labelItems: IItem[] = [
// 	{ title: "Unset", value: "unset", color: "white" },
// 	{ title: "Bug", value: "bug", color: "red.600" },
// 	{ title: "Refactoring", value: "refactoring", color: "orange.600" },
// 	{ title: "Feature", value: "feature", color: "purple.600" },
// ];

// const priorityItems: IItem[] = [
// 	{ title: "Unset", value: "unset", color: "white" },
// 	{ title: "High", value: "high", color: "red.600" },
// 	{ title: "Medium", value: "medium", color: "orange.600" },
// 	{ title: "Low", value: "low", color: "blue.600" },
// ];

type IContextItem = {
	icon?: React.ReactNode;
	title: string;
	type: "item" | "group" | "separator";
	items?: IContextItem[];
	onSelect?: () => void;
};

interface IProps {
	issue?: IIssue;
	pos?: { x: number; y: number };
	open?: boolean;
	onChange?: (open: boolean) => void;
}
export const IssueContextMenu: FC<IProps> = ({ issue, pos, open, onChange }) => {
	// const { data: user } = useGetUser();
	const { data: projects } = useGetProjects();
	const { data: modules } = useQuery({ ...getModulesOptions({ project_id: issue?.project_id }) });
	const { mutate: deleteIssue } = useMutation(deleteIssuesOptions());
	// const { mutate: updateIssue } = useMutation(updateIssueOptions());

	// Group
	// => Item
	// => subitem
	// => infinite subitem

	const contextItems: IContextItem[] = [
		{
			title: "Change",
			type: "group",

			items: [
				{
					title: "Move to",
					type: "item",
					items: [
						{
							title: "Modules",
							type: "group",
							items: modules?.map((module) => ({
								title: module.title,
								type: "item",
								onSelect: () => {
									const commitName = getGitCommitName(issue);
									alert(commitName);
									navigator.clipboard.writeText(commitName);
									toaster.create({
										title: "Git name copied",
										description: commitName,
									});
								},
							})),
						},
						{
							title: "Separator",
							type: "separator",
						},
						{
							title: "Projects",
							type: "group",
							items: projects?.map((project) => ({
								title: project.title,
								type: "item",
							})),
						},
					],
				},
			],
		},
		{
			title: "Copy commit name",
			type: "item",
			onSelect: () => {
				const commitName = getGitCommitName(issue);
				alert(commitName);
				navigator.clipboard.writeText(commitName);
				toaster.create({
					title: "Git name copied",
					description: commitName,
				});
			},
		},
		{
			title: "Delete",
			type: "item",
			onSelect: () => {
				if (!issue) return null;
				console.log({ issue });

				deleteIssue([issue.id], {
					onSuccess: () => {
						refetchQuery([keyFactory.issues.all]);
						toaster.create({
							title: `Issue ${issue?.title} completed`,
							type: "success",
						});
					},
				});
			},
		},
	];

	// const { mutate: updateTask } = useUpdateTask({
	// 	onSuccess: () => {
	// 		client.refetchQueries({ queryKey: useGetTasks.getKey() });
	// 	},
	// });

	if (!open) return null;
	return (
		<Portal>
			<VStack p={0} onClick={(e) => e.stopPropagation()}>
				{/* <HStack>123</HStack> */}
				<Menu.Root open={open} onInteractOutside={() => onChange?.(false)} onOpenChange={(e) => onChange?.(e.open)}>
					<Menu.Positioner>
						<Menu.Content
							// w={"200px"}

							position={"fixed"}
							top={pos?.y}
							left={pos?.x}
						>
							{contextItems?.map((item) => {
								if (item.type === "item") {
									return <MenuItem key={item.title} item={item} />;
								}
								if (item.type === "group") {
									return <MenuItemGroup key={item.title} item={item} />;
								}
								if (item.type === "separator") {
									return <Menu.Separator key={item.title} />;
								}
								return null;
							})}
						</Menu.Content>
					</Menu.Positioner>
				</Menu.Root>
			</VStack>
		</Portal>
	);
};

interface IMenuItemGroup {
	item: IContextItem;
}

export const MenuItemGroup: React.FC<IMenuItemGroup> = ({ item }) => {
	return (
		<Menu.ItemGroup key={item.title}>
			<Menu.ItemGroupLabel>{item.title}</Menu.ItemGroupLabel>
			{item.items?.map((i) => {
				return <MenuItem key={i.title} item={i} />;
			})}
		</Menu.ItemGroup>
	);
};

interface IMenuItem extends Omit<Menu.ItemProps, "value"> {
	item: IContextItem;
}
export const MenuItem: React.FC<IMenuItem> = ({ item, ...props }) => {
	const haveSubmenu = !!item?.items?.length;
	const Container = haveSubmenu ? Menu.TriggerItem : Menu.Item;
	return (
		<Menu.Root positioning={{ placement: "right-start", gutter: 2 }} closeOnSelect>
			<Container
				whiteSpace={"nowrap"}
				value={item.title}
				onSelect={() => item.onSelect?.()}
				onClick={(e) => {
					e.stopPropagation();
					item.onSelect?.();
				}}
				{...props}
			>
				{item.title}
				{haveSubmenu && <IconChevronRight size={"16px"} />}
			</Container>
			<Portal>
				<Menu.Positioner>
					<Menu.Content>
						{item.items?.map((i) => {
							if (i.type === "item") {
								return <MenuItem key={i.title} item={i} />;
							}
							if (i.type === "group") {
								return <MenuItemGroup key={i.title} item={i} />;
							}
							if (i.type === "separator") {
								return <Menu.Separator key={i.title} />;
							}
							return null;
						})}
					</Menu.Content>
				</Menu.Positioner>
			</Portal>
		</Menu.Root>
	);
};
