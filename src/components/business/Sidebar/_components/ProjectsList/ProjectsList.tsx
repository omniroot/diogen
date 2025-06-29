import { useGetProjects } from "@/api/queries/projects.api";
import { ProjectItem } from "@/components/business/Sidebar/_components/ProjectItem/ProjectItem.tsx";
import { VStack } from "@chakra-ui/react";
import { FC } from "react";

interface IProps {}

export const ProjectsList: FC<IProps> = ({}) => {
  const { data: projects } = useGetProjects();

  if (!projects) return null;
  return (
    <VStack w="100%">
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </VStack>
  );
};
