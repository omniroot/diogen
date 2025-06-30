import { VStack } from "@chakra-ui/react";
import type { FC } from "react";
import { useGetProjects } from "@/api/queries/projects.api";
import { ProjectItem } from "@/components/business/Sidebar/_components/ProjectItem/ProjectItem.tsx";

type IProps = {};

export const ProjectsList: FC<IProps> = ({}) => {
  const { data: projects } = useGetProjects({ variables: {} });
  console.log(projects);

  if (!projects) return null;
  return (
    <VStack w="100%">
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </VStack>
  );
};
