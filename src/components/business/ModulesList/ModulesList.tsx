import { useGetModules } from "@/api/queries/modules.api.ts";
import { IProject } from "@/api/supabase.interface.ts";
import { ModuleItem } from "@/components/business/ModuleItem/ModuleItem.tsx";
import { HStack } from "@chakra-ui/react";
import { FC } from "react";

interface IModulesListProps {
  project: IProject;
}
export const ModulesList: FC<IModulesListProps> = ({ project }) => {
  const { data: modules } = useGetModules({
    variables: { project_id: project?.id },
  });

  if (!modules) return null;
  return (
    <HStack w="100%" gap="12px">
      {modules.map((module) => {
        return <ModuleItem module={module} />;
      })}
    </HStack>
  );
};
