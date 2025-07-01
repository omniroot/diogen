import { useGetModules } from "@/api/queries/modules.api.ts";
import type { IProject } from "@/api/supabase.interface.ts";
import { ModuleItem } from "@/components/business/ModuleItem/ModuleItem.tsx";
import { CreateModuleModal } from "@/components/modals/CreateModuleModal/CreateModuleModal.tsx";
import { HStack, Text, VStack } from "@chakra-ui/react";
import type { FC } from "react";

interface IModulesListProps {
  project: IProject;
}
export const ModulesList: FC<IModulesListProps> = ({ project }) => {
  const { data: modules } = useGetModules({
    variables: { project_id: project?.id },
  });

  if (!modules) return null;
  return (
    <VStack w="100%">
      <HStack w="100%" justifyContent={"space-between"} p="8px">
        <HStack>
          <Text
            fontSize={{ base: "2xl", sm: "xl", md: "2xl" }}
            fontWeight={"bold"}
          >
            Modules
          </Text>
        </HStack>

        <HStack>
          {/* <Button
            variant={"outline"}
            onClick={() => setSortType((prev) => !prev)}
          >
            {sortType ? <LuCalendarArrowDown /> : <LuCalendarArrowUp />}
          </Button> */}
          <CreateModuleModal />
        </HStack>
      </HStack>
      <HStack w="100%" overflowX={"auto"}>
        {/* {tasksIsFetching && <Text>Loading...</Text>} */}
        {modules?.map((module) => {
          return <ModuleItem key={module.id} module={module} />;
        })}
      </HStack>
    </VStack>
  );
};
