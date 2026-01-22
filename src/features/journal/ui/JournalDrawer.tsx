import { Button, Field, HStack, Input, VStack } from "@chakra-ui/react";
import { useForm } from "@tanstack/react-form";
import type { JournalEntries } from "@/api/types/appwrite.js";
import { UniversalModal } from "@/components/ResponsiveOverlay.tsx";
import { useJournal } from "@/features/journal/api/journal-entries.api.ts";
import { useApp } from "@/hooks/useApp.tsx";
import { useDrawers } from "@/hooks/useDrawers.tsx";
import { capitalize } from "@/utils/capitalize.ts";

type Props = { a?: any };
export const JournalDrawer: React.FC<Props> = () => {
	const { selectedDate } = useApp();
	const { isOpen, toggle, currentDrawer } = useDrawers("journal");
	const { createJournal } = useJournal({ type: "null" }).domain;
	let defaultValues: Pick<JournalEntries, "date" | "content"> | null = null;

	switch (currentDrawer?.type) {
		case "create": {
			defaultValues = {
				date: selectedDate,
				content: "",
			};
			break;
		}
		case "update": {
			defaultValues = {
				// title: selectedActivity?.title,
				// type: selectedActivity?.type ?? "habit",
			};
			break;
		}
	}

	const form = useForm({
		defaultValues,
		onSubmit: ({ value }) => {
			switch (currentDrawer?.type) {
				case "create": {
					createJournal(
						{
							content: value?.content,
							date: value?.date,
							// description: null,
							// icon: null,
						},
						() => toggle("create"),
					);
					break;
				}
				case "update": {
					// updateActivity(
					// 	selectedActivity?.$id,
					// 	{
					// 		title: value?.title,
					// 		type: value?.type,
					// 		// description: null,
					// 		// icon: null,
					// 	},
					// 	() => toggle("update"),
					// );
					break;
				}
			}
		},
	});

	return (
		<UniversalModal
			open={isOpen}
			onOpenChange={() => toggle(currentDrawer?.type ?? "create")}
			title={`${capitalize(currentDrawer?.type ?? "")} journal`}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<VStack w={"100%"} alignItems={"start"}>
					<Field.Root>
						<Field.Label>Date</Field.Label>
						<form.Field name="date">
							{(field) => {
								return (
									<Input
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Date"
									/>
								);
							}}
						</form.Field>
					</Field.Root>
					<Field.Root>
						<Field.Label>Content</Field.Label>
						<form.Field name="content">
							{(field) => {
								return (
									<Input
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Content"
									/>
								);
							}}
						</form.Field>
					</Field.Root>

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
