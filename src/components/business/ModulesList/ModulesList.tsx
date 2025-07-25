import { useGetModules } from "@/api/queries/modules.api.ts";
import type { IProject } from "@/api/supabase.interface.ts";
import { ModuleItem } from "@/components/business/ModuleItem/ModuleItem.tsx";
import { CreateModuleModal } from "@/components/modals/CreateModuleModal/CreateModuleModal.tsx";
import { Badge, HStack, Text, VStack } from "@chakra-ui/react";
import type { FC } from "react";

interface IModulesListProps {
  project: IProject;
}
export const ModulesList: FC<IModulesListProps> = ({ project }) => {
  const { data: modules, isFetching } = useGetModules({
    variables: { project_id: project?.id },
  });

  if (!modules) return null;
  return (
    <VStack w="100%">
      <HStack w="100%" justifyContent={"space-between"} p="8px">
        <HStack>
          <Text fontSize={{ base: "xl", sm: "2xl" }} fontWeight={"bold"}>
            Modules
          </Text>
          <Badge
            size={"lg"}
            variant={"solid"}
            transition={"opacity 200ms"}
            opacity={isFetching ? 1 : 0}
          >
            Sync
          </Badge>
        </HStack>

        <HStack>
          <CreateModuleModal />
        </HStack>
      </HStack>
      <HStack w="100%" overflowX={"auto"}>
        {modules?.map((module) => {
          return <ModuleItem key={module.id} module={module} />;
        })}
      </HStack>
    </VStack>
  );
};
