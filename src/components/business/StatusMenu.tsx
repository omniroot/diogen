import { Button, Menu, Portal, Skeleton, useDisclosure } from "@chakra-ui/react";
import { IconQuestionMark } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import type { FC } from "react";
import { updateIssueOptions } from "@/api/queries/issues.api.ts";
import type { IIssue } from "@/api/supabase.interface.ts";
import { BacklogIcon } from "@/assets/icons/backlog-icon.tsx";
import { CanceledIcon } from "@/assets/icons/canceled-icon.tsx";
import { DoneIcon } from "@/assets/icons/done-icon.tsx";
import { ProgressIcon } from "@/assets/icons/progress-icon.tsx";
import { TodoIcon } from "@/assets/icons/todo-icon.tsx";

interface IProps {
	issue: IIssue | undefined;
	isShow?: boolean;
}

interface IItem {
	title: string;
	value: string;
	color: string;
	icon: React.ReactNode;
}

const items: IItem[] = [
	{ title: "Unset (remove in release)", value: "unset", color: "#6A6C6F", icon: <IconQuestionMark /> },
	{ title: "Backlog", value: "backlog", color: "#6A6C6F", icon: <BacklogIcon /> },
	{ title: "Todo", value: "todo", color: "#D3D3D3", icon: <TodoIcon /> },
	{ title: "Progress", value: "progress", color: "#F0BF0A", icon: <ProgressIcon /> },
	{ title: "Done", value: "done", color: "#5E6AD2", icon: <DoneIcon /> },
	{ title: "Canceled", value: "canceled", color: "#95A2B3", icon: <CanceledIcon /> },
];

const getSelectedItem = (status: IIssue["status"] | undefined) => {
	return items.filter((i) => i.value === status)?.[0]?.icon || items.filter((i) => i.value === "unset")?.[0]?.icon;
};

export const StatusMenu: FC<IProps> = ({ issue, isShow = true }) => {
	const { open, onToggle } = useDisclosure();
	const { mutate: updateIssue } = useMutation(updateIssueOptions());
	// const { mutate: updateTask } = update({
	//   onSuccess: () => {
	//     client.refetchQueries({ queryKey: useGetTasks.getKey() });
	//     client.refetchQueries({ queryKey: useGetTask.getKey({ id: task?.id }) });
	//   },
	// });

	const onItemSelect = (item: IItem) => {
		updateIssue({
			id: issue?.id,
			status: item.value,
		});
	};

	if (!isShow) return null;

	return (
		<Menu.Root open={open} onOpenChange={onToggle}>
			<Menu.Trigger asChild>
				<Skeleton loading={!issue}>
					<Button
						variant="ghost"
						// w={"45px"}
						// h={"45px"}
						size="sm"
						p={1}
						bg={{ _hover: "hover_variant" }}
						// border={"2px solid {colors.outline_variant}"}
						// borderWidth={"2px"}
						// borderColor={{
						// 	_default: getTaskColor(issue?.label as ILabel),
						// }}
						// borderRadius={"full"}
						// hidden={!isShow}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onToggle();
						}}
					>
						{getSelectedItem(issue?.status)}
						{/* {issue?.status || "Status"} */}
					</Button>
				</Skeleton>
			</Menu.Trigger>
			<Portal>
				<Menu.Positioner>
					<Menu.Content>
						{items.map((item) => {
							return (
								<Menu.Item
									value={item.value}
									color={item.color}
									onSelect={() => onItemSelect(item)}
									onClick={(e) => e.preventDefault()}
									key={item.value}
								>
									{item.icon}
									{item.title}
								</Menu.Item>
							);
						})}
					</Menu.Content>
				</Menu.Positioner>
			</Portal>
		</Menu.Root>
	);
};
