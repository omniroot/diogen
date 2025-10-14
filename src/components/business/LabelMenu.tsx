import { Button, Menu, Portal, Skeleton, useDisclosure } from "@chakra-ui/react";
import type { FC } from "react";
import type { IIssue } from "@/api/supabase.ts";
import { ProjectCircle } from "@/components/business/ProjectCircle/ProjectCircle.tsx";

type ILabel = null | "bug" | "refactoring" | "feature";

const getTaskColor = (priority: ILabel) => {
	if (priority === "bug") return "red.600";
	if (priority === "refactoring") return "orange.600";
	if (priority === "feature") return "purple.600";
	return "outline_variant";
};

interface IProps {
	issue: IIssue | undefined;
	isShow?: boolean;
}

interface IItem {
	title: string;
	value: string;
	color: string;
}

const items: IItem[] = [
	{ title: "Unset", value: "unset", color: "white" },
	{ title: "Bug", value: "bug", color: "red.600" },
	{ title: "Refactoring", value: "refactoring", color: "orange.600" },
	{ title: "Feature", value: "feature", color: "purple.600" },
];

export const LabelMenu: FC<IProps> = ({ issue, isShow = true }) => {
	const { open, onToggle } = useDisclosure();
	// const { mutate: updateTask } = useUpdateTask({
	//   onSuccess: () => {
	//     client.refetchQueries({ queryKey: useGetTasks.getKey() });
	//     client.refetchQueries({ queryKey: useGetTask.getKey({ id: task?.id }) });
	//   },
	// });

	// const onItemSelect = (item: IItem) => {
	//   // if (issue)
	//   //   updateTask({
	//   //     id: task.id,
	//   //     data: {
	//   //       label: item.value === "unset" ? null : item.value,
	//   //     },
	//   //   });
	// };

	if (!isShow) return null;

	return (
		<Menu.Root open={open} onOpenChange={onToggle}>
			<Menu.Trigger asChild>
				<Skeleton loading={!issue}>
					<Button
						// variant="outline"
						size="sm"
						border={"2px solid {colors.outline_variant}"}
						// borderWidth={"2px"}
						borderColor={{
							_default: getTaskColor(issue?.label as ILabel),
						}}
						borderRadius={"full"}
						hidden={!isShow}
						onClick={(e) => {
							e.preventDefault();
							onToggle();
						}}
					>
						<ProjectCircle color={getTaskColor(issue?.label as ILabel)} variant="filled" />
						{issue?.label || "Label"}
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
									// onSelect={() => onItemSelect(item)}
									key={item.value}
								>
									<ProjectCircle color={item.color} variant="filled" />
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
