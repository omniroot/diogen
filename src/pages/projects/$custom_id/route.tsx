import { HStack, Image, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getProjectOptions } from "@/api/queries/projects.api.ts";
import { supabase } from "@/api/supabase.ts";
import { ProjectLinkTabs } from "@/components/business/ProjectLinkTabs.tsx";
import { useLocationStore } from "@/stores/location.store.tsx";

export const Route = createFileRoute("/projects/$custom_id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { custom_id } = useLocationStore();
	// const [value] = useState<string | null>(getSelectedValue(useLocation().href));
	const { data: project, isFetching: projectIsLoading, refetch } = useQuery(getProjectOptions({ custom_id }));
	const { data: logo } = useQuery({
		queryKey: ["logo", project?.id],
		queryFn: () => supabase.storage.from("logos").getPublicUrl(project?.logo || ""),
	});

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

			<ProjectLinkTabs key={`project-${custom_id}`} />
			{/* <Button onClick={() => toaster.create({ title: "Hello", description: "World", closable: true })}>Refetch</Button> */}

			{/* <HStack w={"100%"} border={"2px solid {colors.outline}"} p={2} borderRadius={"md"}>
				<ChakraLink asChild _active={{ color: "red" }} _current={{ color: "red" }}>
					<Link to="/projects/$custom_id/issues" params={{ custom_id: String(custom_id) }}>
						Issues
					</Link>
				</ChakraLink>

				<Link to="/projects/$custom_id/modules" params={{ custom_id: String(custom_id) }}>
					Modules
				</Link>
			</HStack> */}

			<Outlet />
			{/* <DndContext onDragEnd={onDragEnd}> */}
			{/* <ModulesList project={project} /> */}
		</>
	);
}
