import {
	Button,
	createListCollection,
	Field,
	HStack,
	Input,
	Portal,
	Select,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useForm } from "@tanstack/react-form";
import type { Activities } from "@/api/types/appwrite.d.ts";
import { UniversalModal } from "@/components/ResponsiveOverlay.tsx";
import { useActivities } from "@/features/activities/api/activities.api.ts";
import { useApp } from "@/hooks/useApp.tsx";
import { useDrawers } from "@/hooks/useDrawers";
import { capitalize } from "@/utils/capitalize.ts";

const activityTypeList = createListCollection<{
	label: string;
	value: Activities["type"];
}>({
	items: [
		{ label: "Habit", value: "habit" },
		{ label: "Task", value: "task" },
		// { label: "Goal", value: "goal" },
	],
});

type Props = { a?: null };
export const ActivityDrawer: React.FC<Props> = () => {
	const { selectedActivity } = useApp();
	// const { user } = useAuth();
	const { toggle, isOpen, currentDrawer } = useDrawers("activity");
	const { createActivity, updateActivity, deleteActivity } = useActivities({
		type: "null",
	}).domain;

	let defaultValues: Pick<Activities, "title" | "type"> | null = null;

	switch (currentDrawer?.type) {
		case "create": {
			defaultValues = {
				title: "",
				type: "habit",
			};
			break;
		}
		case "update": {
			defaultValues = {
				title: selectedActivity?.title,
				type: selectedActivity?.type ?? "habit",
			};
			break;
		}
	}

	const form = useForm({
		defaultValues,
		onSubmit: ({ value }) => {
			switch (currentDrawer?.type) {
				case "create": {
					createActivity(
						{
							title: value?.title,
							type: value?.type,
							// description: null,
							// icon: null,
						},
						() => toggle("create"),
					);
					break;
				}
				case "update": {
					updateActivity(
						selectedActivity?.$id,
						{
							title: value?.title,
							type: value?.type,
							// description: null,
							// icon: null,
						},
						() => toggle("update"),
					);
					break;
				}
			}
		},
	});

	if (currentDrawer?.type === "delete") {
		return (
			<UniversalModal
				open={isOpen}
				onOpenChange={() => toggle(currentDrawer?.type ?? "create")}
				title={`Delete "${selectedActivity?.title}" activity`}
			>
				<VStack p={2} alignItems={"start"}>
					<Text fontSize={"16px"}>You want to delete this activity?</Text>
					<HStack w={"100%"} my={2} justifyContent={"space-between"}>
						<Button variant={"surface"} onClick={() => toggle("delete")}>
							Cancel
						</Button>
						<Button
							variant={"primary"}
							onClick={() =>
								deleteActivity(selectedActivity?.$id, () => toggle("delete"))
							}
						>
							Delete
						</Button>
					</HStack>
				</VStack>
			</UniversalModal>
		);
	}

	return (
		<UniversalModal
			open={isOpen}
			onOpenChange={() => toggle(currentDrawer?.type ?? "create")}
			title={`${capitalize(currentDrawer?.type ?? "")} activity`}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<VStack w={"100%"} alignItems={"start"}>
					<Field.Root>
						<Field.Label>Title</Field.Label>
						<form.Field name="title">
							{(field) => {
								return (
									<Input
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Title"
									/>
								);
							}}
						</form.Field>
					</Field.Root>
					<form.Field name="type">
						{(field) => {
							return (
								<Select.Root
									collection={activityTypeList}
									size="sm"
									width="fit-content"
									value={[field.state.value]}
								>
									<Select.HiddenSelect />
									<Select.Label>Select type</Select.Label>
									<Select.Control>
										<Select.Trigger>
											<Select.ValueText placeholder="Select type" />
										</Select.Trigger>
										<Select.IndicatorGroup>
											<Select.Indicator />
										</Select.IndicatorGroup>
									</Select.Control>
									<Portal>
										<Select.Positioner>
											<Select.Content zIndex={"999999999999999999"}>
												{activityTypeList.items.map((activityType) => (
													<Select.Item
														item={activityType}
														key={activityType.value}
														onClick={() => field.handleChange(activityType.value)}
													>
														{activityType.label}
														<Select.ItemIndicator />
													</Select.Item>
												))}
											</Select.Content>
										</Select.Positioner>
									</Portal>
								</Select.Root>
							);
						}}
					</form.Field>
					<HStack w={"100%"} justifyContent={"end"}>
						<Button borderRadius={"full"} type="submit">
							{capitalize(currentDrawer?.type ?? "")}
						</Button>
					</HStack>

					{/* ACtivity drawer {selectedDate} at type {currentDrawer?.type} */}
				</VStack>
			</form>
		</UniversalModal>
	);
};
