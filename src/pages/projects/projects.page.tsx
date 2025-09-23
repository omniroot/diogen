import { getProjectsOptions } from "@/api/queries/projects.api.ts";
import { HStack, Skeleton, Text, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

// const route = getRouteApi("/projects");

export const ProjectsPage = () => {
  const { data: projects, isLoading: projectIsLoading } =
    useQuery(getProjectsOptions());

  console.log({ projectIsLoading });

  return (
    <>
      {projects?.map((project) => {
        return (
          <VStack
            w="100%"
            bg={{ _default: "surface_container", _hover: "hover" }}
            p="6px"
            borderRadius={"6px"}
            border={"2px solid {colors.outline}"}
            asChild
          >
            <Link
              to="/projects/$custom_id"
              params={{ custom_id: project.custom_id }}
            >
              <Skeleton
                w="100%"
                loading={projectIsLoading}
                borderRadius={"8px"}
              >
                <HStack w="100%">
                  {/* <ProjectCircle color={project?.color} /> */}
                  <Text as={"h1"} fontWeight={"bold"} color={"text"}>
                    {project?.title}
                  </Text>
                </HStack>
              </Skeleton>

              <Skeleton
                w="100%"
                loading={projectIsLoading}
                borderRadius={"8px"}
              >
                <HStack w="100%">
                  <Text as={"h3"} color={"text_variant"}>
                    {project?.description}
                  </Text>
                </HStack>
              </Skeleton>
            </Link>
          </VStack>
        );
      })}

      {/* <DndContext onDragEnd={onDragEnd}> */}
      {/* <ModulesList project={project} /> */}

      {/* <TasksList project_id={project?.id} module_id={null} empty_module_id /> */}
    </>
  );
};
