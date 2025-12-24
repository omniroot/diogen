import { Button, Menu, Portal, Skeleton, useDisclosure } from "@chakra-ui/react";
import { type FC, type SetStateAction, useId } from "react";
import { ProjectCircle } from "@/components/business/ProjectCircle/ProjectCircle.tsx";

// type ILabel = null | "bug" | "refactoring" | "feature";

// const getTaskColor = (priority: ILabel) => {
// 	if (priority === "bug") return "red.600";
// 	if (priority === "refactoring") return "orange.600";
// 	if (priority === "feature") return "purple.600";
// 	return "outline_variant";
// };

interface IProps {
	value?: string | null | undefined;
	onChange?: (newValue: SetStateAction<string>) => void;

	showTitle?: boolean;
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

export const LabelSelect: FC<IProps> = ({
	value = "unset",
	onChange,
	showTitle = false,
}) => {
	const id = useId();
	const { open, onToggle } = useDisclosure();
	const selectedItem = items.filter((i) => i.value === value)[0] || items[0];
	// const { mutate: updateTask } = useUpdateTask({
	//   onSuccess: () => {
	//     client.refetchQueries({ queryKey: useGetTasks.getKey() });
	//     client.refetchQueries({ queryKey: useGetTask.getKey({ id: task?.id }) });
	//   },
	// });

	const onItemSelect = (item: IItem) => {
		onChange?.(item.value || "");
		// if (issue)
		//   updateTask({
		//     id: task.id,
		//     data: {
		//       label: item.value === "unset" ? null : item.value,
		//     },
		//   });
	};

	if (!value) return null;
	return (
		<Menu.Root open={open} onOpenChange={onToggle} id={id}>
			<Menu.Trigger asChild>
				<Skeleton loading={!value} asChild>
					<Button
						// variant="outline"
						size="sm"
						border={"2px solid {colors.outline_variant}"}
						// borderWidth={"2px"}
						borderColor={{
							base: selectedItem.color,
						}}
						borderRadius={"full"}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							onToggle();
						}}
					>
						<ProjectCircle color={selectedItem.color} variant="filled" />
						{showTitle && selectedItem.title}
					</Button>
				</Skeleton>
			</Menu.Trigger>
			<Portal>
				<Menu.Positioner>
					<Menu.Content
						zIndex={"max"}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
					>
						{items.map((item) => {
							return (
								<Menu.Item
									value={item.value}
									color={item.color}
									onSelect={() => onItemSelect(item)}
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
