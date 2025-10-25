import { Badge, Button, HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { getModuleOptions } from "@/api/queries/modules.api.ts";
import { IssueList } from "@/features/issues/components/IssueList";
import { useLocationStore } from "@/stores/location.store.tsx";
import { useModals } from "@/stores/modals.store.tsx";

export const Route = createFileRoute("/projects/$custom_id/modules/$module_id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { project_id, module_id } = useLocationStore();
	const { open: openModal } = useModals("module");
	const { data: module, isFetching } = useQuery(getModuleOptions({ id: Number(module_id) }));

	console.log(useLocationStore());

	useEffect(() => {
		useLocationStore.setState({});
	}, []);

	return (
		<>
			<VStack w="100%" p="6px" borderRadius={"6px"} alignItems={"start"} border={"2px solid {colors.outline}"}>
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
						<Button onClick={() => openModal("update")}>
							<IconEdit />
							Edit
						</Button>
						<Button onClick={() => openModal("delete")}>
							<IconTrash />
							Delete
						</Button>
					</HStack>
				</HStack>
			</VStack>
			<IssueList project_id={project_id} module_id={module?.id} />
		</>
	);
}
