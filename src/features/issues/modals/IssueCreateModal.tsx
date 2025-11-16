import { Button, CloseButton, Dialog, HStack, Input, Portal, Separator, Textarea } from "@chakra-ui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "@uidotdev/usehooks";
import { type FC, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { keyFactory, refetchQuery } from "@/api/api.ts";
import { createIssueOptions } from "@/api/queries/issues.api.ts";
import { getModuleOptions } from "@/api/queries/modules.api.ts";
import type { IIssueInsert } from "@/api/supabase.ts";
import { StatusSelect } from "@/components/business/StatusSelect.tsx";
import type { IModuleModal } from "@/features/modules/components/ModuleModal.tsx";
import { useLocationStore } from "@/stores/location.store.tsx";
import { useModals } from "@/stores/modals.store.tsx";
import { EmojiPicker, type IEmoji } from "@/theme/components/EmojiPicker.tsx";

export const IssueCreateModal: FC<IModuleModal> = ({ open, onChange }) => {
	const isDesktop = useMediaQuery("(min-width: 1280px)");

	const { project_id, custom_id, module_id } = useLocationStore();
	const { close } = useModals("module");
	const [statusValue, setStatusValue] = useState("backlog");

	// const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		// formState: { errors },
		reset,
	} = useForm<IIssueInsert>({});

	const [_, setEmoji] = useState<IEmoji | null>(null);

	const { data: module } = useQuery(getModuleOptions({ id: Number(module_id) }));
	const { mutate: createIssue } = useMutation(createIssueOptions());

	const onSubmit: SubmitHandler<IIssueInsert> = (data) => {
		createIssue(
			{ ...data, project_id, module_id },
			{
				onSuccess: () => {
					refetchQuery(keyFactory.modules.list(project_id));
					reset();
					close();
				},
			},
		);
	};

	return (
		<Dialog.Root open={open} onOpenChange={(e) => onChange(e.open)}>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content minW={isDesktop ? "1000px" : "90dvw"}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Dialog.Header>
								<Dialog.Title>Create Issue</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body display={"flex"} flexDirection={"column"} gap={4} maxH={"70dvh"}>
								{custom_id} {">"} {"modules > "} {module?.title}
								<HStack gap={0} position={"relative"}>
									<EmojiPicker onChange={setEmoji} />

									<Input
										placeholder="Module Name"
										border={"none"}
										outline={"none"}
										fontSize={"lg"}
										_placeholder={{ color: "subtext2" }}
										autoFocus
										{...register("title")}
									/>
								</HStack>
								<Separator borderWidth={"1.5px"} />
								<HStack>
									<StatusSelect value={statusValue} onChange={setStatusValue} showTitle={true} />
									{/* <LabelSelect value={labelValue} onChange={setLabelValue} showTitle={true} /> */}
								</HStack>
								<Textarea
									w={"100%"}
									h={"80dvh"}
									fontSize={"lg"}
									placeholder="Description"
									_placeholder={{ color: "subtext2" }}
									border={"none"}
									outline={"2px solid {colors.outline}"}
									overflowY={"auto"}
									resize={"none"}
									borderRadius={"sm"}
									{...register("description")}
								/>
							</Dialog.Body>
							<Dialog.Footer>
								<Dialog.ActionTrigger asChild>
									<Button variant="outline">Cancel</Button>
								</Dialog.ActionTrigger>
								<Button variant={"primary"} type="submit">
									Create
								</Button>
							</Dialog.Footer>
							<Dialog.CloseTrigger asChild>
								<CloseButton size="sm" />
							</Dialog.CloseTrigger>
						</form>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
