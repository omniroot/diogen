import {
	Badge,
	Button,
	CloseButton,
	Dialog,
	HStack,
	Portal,
	Skeleton,
	Text,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import { IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { refetchQuery } from "@/api/api.ts";
import { deleteIssuesOptions, getIssuesOptions } from "@/api/queries/issues.api.ts";
import { deleteModuleOptions, getModuleOptions } from "@/api/queries/modules.api.ts";
import { queryKeys } from "@/api/query_keys.ts";
import { IssueList } from "@/components/business/IssueList.tsx";
import { useLocationStore } from "@/stores/location.store.tsx";

export const Route = createFileRoute("/projects/$custom_id/modules/$module_id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { open, onToggle } = useDisclosure();
	const { project_id, custom_id, module_id } = useLocationStore();
	const navigate = useNavigate();
	const { data: issues } = useQuery(getIssuesOptions({ project_id: Number(project_id), module_id: Number(module_id) }));
	const { mutate: deleteIssues } = useMutation(deleteIssuesOptions());
	const { data: module, isFetching } = useQuery(getModuleOptions({ id: Number(module_id) }));
	const { mutate: deleteModule } = useMutation(deleteModuleOptions());
	console.log(useLocationStore());

	useEffect(() => {
		useLocationStore.setState({});
	}, []);

	const onDeleteClick = () => {
		if (!module) return;
		deleteIssues(issues?.map((i) => i.id) || [-9999], {
			onSuccess: () => {
				deleteModule(
					{ ids: [module.id] },
					{
						onSuccess: () => {
							onToggle();
							refetchQuery(queryKeys.modules.many(project_id));
							navigate({ to: "/projects/$custom_id", params: { custom_id: String(custom_id) } });
						},
					},
				);
			},
		});
	};
	return (
		<VStack w={"100%"}>
			<HStack w="100%">
				<VStack w="100%" borderRadius={"6px"} alignItems={"start"}>
					{/* <Image src={logo?.data.publicUrl} w={"50px"} h={"50px"} borderRadius={"md"} /> */}
					<Skeleton w="100%" loading={isFetching} borderRadius={"8px"}>
						<HStack w="100%">
							{/* <ProjectCircle color={project?.color} /> */}
							<Text as={"h1"} fontWeight={"bold"} color={"text"}>
								{module?.title}
							</Text>
						</HStack>
					</Skeleton>

					<Skeleton w="100%" loading={isFetching} borderRadius={"8px"}>
						<HStack w="100%">
							<Text as={"h3"} color={"text_variant"}>
								{module?.description}
							</Text>
						</HStack>
					</Skeleton>
					{module?.status && <Badge size={"lg"}>{module?.status}</Badge>}
				</VStack>

				<HStack>
					<Dialog.Root open={open} onOpenChange={onToggle}>
						<Dialog.Trigger asChild>
							<Button>
								<IconTrash />
								Delete
							</Button>
						</Dialog.Trigger>
						<Portal>
							<Dialog.Backdrop />
							<Dialog.Positioner>
								<Dialog.Content>
									<Dialog.Header>
										<Dialog.Title>Dialog Title</Dialog.Title>
									</Dialog.Header>
									<Dialog.Body>
										<Text>Are you sure you want to delete {module?.title} module and all issues in it?</Text>
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
				</HStack>
			</HStack>
			<IssueList project_id={project_id} module_id={module?.id} />
		</VStack>
	);
}
