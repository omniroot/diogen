import { HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getProjectOptions } from "@/api/queries/projects.api.ts";
import { IssueList } from "@/components/business/IssueList.tsx";

const route = getRouteApi("/projects/$custom_id");

export const ProjectPage = () => {
	const { custom_id } = route.useParams();
	const { data: project, isFetching: projectIsLoading, refetch } = useQuery(getProjectOptions({ custom_id }));

	return (
		<>
			<VStack w="100%" p="6px" borderRadius={"6px"} border={"2px solid {colors.outline}"}>
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

			{/* <DndContext onDragEnd={onDragEnd}> */}
			{/* <ModulesList project={project} /> */}

			<IssueList project_id={project?.id} />
		</>
	);
};
