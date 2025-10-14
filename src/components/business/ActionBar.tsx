import {
	Button,
	ActionBar as CActionBar,
	CloseButton,
	Dialog,
	IconButton,
	Portal,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import { IconTrash } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { deleteIssuesOptions } from "@/api/queries/issues.api.ts";
import { useSelectionStore } from "@/stores/selection.store.tsx";

export const ActionBar: React.FC = () => {
	const { open, onToggle } = useDisclosure();
	const { issues, toggleIssue } = useSelectionStore();
	const { mutate: deleteIssues } = useMutation(deleteIssuesOptions());

	const onDeleteClick = () => {
		deleteIssues(issues.map((i) => i.id));
		issues.forEach((i) => {
			toggleIssue(i);
		});
		onToggle();
	};

	return (
		<CActionBar.Root open={issues.length > 0}>
			<Portal>
				<CActionBar.Positioner>
					<CActionBar.Content>
						<CActionBar.SelectionTrigger border={"2px solid {colors.outline_variant}"} borderRadius={"md"}>
							{issues.length} issue{issues.length > 1 ? "s" : ""}
						</CActionBar.SelectionTrigger>
						<CActionBar.Separator />

						<Dialog.Root open={open} onOpenChange={onToggle}>
							<Dialog.Trigger asChild>
								<IconButton variant={"outline"}>
									<IconTrash />
								</IconButton>
							</Dialog.Trigger>
							<Portal>
								<Dialog.Backdrop />
								<Dialog.Positioner>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Dialog Title</Dialog.Title>
										</Dialog.Header>
										<Dialog.Body>
											<Text>Are you sure you want to delete these issues?</Text>
										</Dialog.Body>
										<Dialog.Footer>
											<Dialog.ActionTrigger asChild>
												<Button variant="outline">Cancel</Button>
											</Dialog.ActionTrigger>
											<Button variant={"primary"} onClick={onDeleteClick}>
												Delete
											</Button>
										</Dialog.Footer>
										<Dialog.CloseTrigger asChild>
											<CloseButton size="sm" />
										</Dialog.CloseTrigger>
									</Dialog.Content>
								</Dialog.Positioner>
							</Portal>
						</Dialog.Root>
					</CActionBar.Content>
				</CActionBar.Positioner>
			</Portal>
		</CActionBar.Root>
	);
};
