import { useGetProjects } from "@/api/queries/projects.api";
import { IProject } from "@/api/supabase.interface";
import { ProjectItem } from "@/components/ui/Sidebar/_components/ProjectItem/ProjectItem";
import { Text, VStack } from "@chakra-ui/react";
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
