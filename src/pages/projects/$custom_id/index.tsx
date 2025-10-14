import { Button, HStack, Image, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { getProjectOptions } from "@/api/queries/projects.api.ts";
import { supabase } from "@/api/supabase.ts";
import { IssueList } from "@/components/business/IssueList.tsx";
import { ModuleList } from "@/features/modules/_components/ModuleList";
import { useLocationStore } from "@/stores/location.store.tsx";
import { toaster } from "@/theme/components/toaster.tsx";

export const Route = createFileRoute("/projects/$custom_id/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { custom_id } = useLocationStore();
	const { data: project, isFetching: projectIsLoading, refetch } = useQuery(getProjectOptions({ custom_id }));
	const { data: logo } = useQuery({
		queryKey: ["logo", project?.id],
		queryFn: () => supabase.storage.from("logos").getPublicUrl(project?.logo || ""),
	})

	if (!project) return null;

	return (
		<>
			<VStack w="100%" p="6px" borderRadius={"6px"} alignItems={"start"} border={"2px solid {colors.outline}"}>
				<Image src={logo?.data.publicUrl} w={"50px"} h={"50px"} borderRadius={"md"} />
				<Skeleton w="100%" loading={projectIsLoading} borderRadius={"8px"}>
					<HStack w="100%">
						{/* <ProjectCircle color={project?.color} /> */}
						<Text as={"h1"} fontWeight={"bold"} color={"text"} onClick={() => refetch()}>
							{project?.title}
						</Text>
					</HStack>
				</Skeleton>

				<Skeleton w="100%" loading={projectIsLoading} borderRadius={"8px"}>
					<HStack w="100%">
						<Text as={"h3"} color={"text_variant"}>
							{project?.description}
						</Text>
					</HStack>
				</Skeleton>
			</VStack>

			<Button onClick={() => toaster.create({ title: "Hello", description: "World" })}>Refetch</Button>

			{/* <DndContext onDragEnd={onDragEnd}> */}
			{/* <ModulesList project={project} /> */}

			<ModuleList project_id={project?.id} />
			<IssueList project_id={project?.id} filterByEmptyModule />
		</>
	)
}
