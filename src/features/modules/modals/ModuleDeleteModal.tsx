import { Badge, Button, Dialog, Portal, Text } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useMediaQuery } from "@uidotdev/usehooks";
import type { FC } from "react";
import { keyFactory, refetchQuery } from "@/api/api.ts";
import { deleteIssuesOptions, getIssuesOptions } from "@/api/queries/issues.api.ts";
import { deleteModuleOptions, getModuleOptions } from "@/api/queries/modules.api.ts";
import type { IModuleModal } from "@/features/modules/components/ModuleModal.tsx";
import { useLocationStore } from "@/stores/location.store.tsx";

export const ModuleDeleteModal: FC<IModuleModal> = ({ open, onChange }) => {
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const { project_id, custom_id, module_id } = useLocationStore();
	const navigate = useNavigate();

	const { data: module } = useQuery(getModuleOptions({ id: Number(module_id) }));
	const { data: issues } = useQuery(
		getIssuesOptions({ project_id: Number(project_id), module_id: Number(module_id) }),
	);
	const { mutate: deleteIssues } = useMutation(deleteIssuesOptions());
	const { mutate: deleteModule } = useMutation(deleteModuleOptions());

	const onDeleteClick = () => {
		if (!module) return;
		deleteIssues(issues?.map((i) => i.id) || [-9999], {
			onSuccess: () => {
				deleteModule(
					{ ids: [module.id] },
					{
						onSuccess: () => {
							onChange(false);
							refetchQuery(keyFactory.modules.list(project_id));
							navigate({
								to: "/projects/$custom_id",
								params: { custom_id: String(custom_id) },
							});
						},
					},
				);
			},
		});
	};
	return (
		<Dialog.Root open={open} onOpenChange={(e) => onChange(e.open)}>
			<Dialog.Trigger asChild></Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content minW={isDesktop ? "1000px" : "90dvw"}>
						<Dialog.Header>
							<Dialog.Title>Delete Module</Dialog.Title>
						</Dialog.Header>
						<Dialog.Body>
							<Text>
								Are you sure you want to delete{" "}
								<Badge color={"primary"} bg={"surface_container_high"} mx={1}>
									{module?.title}
								</Badge>
								module and all issues in it?
							</Text>
						</Dialog.Body>
						<Dialog.Footer>
							<Dialog.ActionTrigger asChild>
								<Button variant="outline">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button
								variant={"primary"}
								type="submit"
								bg={"red.500"}
								color={"black"}
								onClick={onDeleteClick}
							>
								Delete
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
