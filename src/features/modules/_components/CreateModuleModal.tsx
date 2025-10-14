import { Button, CloseButton, Dialog, HStack, IconButton, Input, Portal, Separator, Textarea } from "@chakra-ui/react";
import { useKeyPress } from "@siberiacancode/reactuse";
import { IconMoodUnamused } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";
import { refetchQuery } from "@/api/api.ts";
import { createModulesOptions } from "@/api/queries/modules.api.ts";
import { queryKeys } from "@/api/query_keys.ts";
import type { IModuleInsert } from "@/api/supabase.ts";
import { useLocationStore } from "@/stores/location.store.tsx";
import { useModalsStore } from "@/stores/modals.store.tsx";

export const CreateModuleModal = () => {
	const { project_id } = useLocationStore();
	const createModuleModal = useModalsStore((state) => state.createModuleModal);
	const setCreateModuleModal = useModalsStore((state) => state.setCreateModuleModal);
	const { mutate: createModule } = useMutation(createModulesOptions());
	const {
		register,
		handleSubmit,
		// formState: { errors },
		reset,
	} = useForm<IModuleInsert>({});
	useKeyPress("m", (_, event) => {
		if (!createModuleModal) {
			setCreateModuleModal(true);
			event.preventDefault();
			return;
		}
	});

	// const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
	// 	const handle = handleSubmit((data) => console.log(data));
	// 	handle(event);
	// };

	const onSubmit: SubmitHandler<IModuleInsert> = (data) => {
		createModule([{ ...data, project_id }], {
			onSuccess: () => {
				refetchQuery(queryKeys.modules.many(project_id));
				reset();
				setCreateModuleModal(false);
			},
		});
	};

	return (
		<Dialog.Root open={createModuleModal} onOpenChange={(e) => setCreateModuleModal(e.open)}>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content minW={"1000px"}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Dialog.Header>
								<Dialog.Title>Create Module</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body display={"flex"} flexDirection={"column"} gap={4} maxH={"70dvh"}>
								<HStack gap={0}>
									<IconButton>
										<IconMoodUnamused />
									</IconButton>
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
								<HStack>{/* <LabelMenu issue={}/> */}</HStack>
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
