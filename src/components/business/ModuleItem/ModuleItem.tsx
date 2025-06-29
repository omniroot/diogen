import { IModule } from "@/api/supabase.interface.ts";
import { useGlobalStore } from "@/stores/global.store.ts";
import { Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { FC } from "react";

interface IModuleItemProps {
  module: IModule;
}
export const ModuleItem: FC<IModuleItemProps> = ({ module }) => {
  const { custom_id } = useGlobalStore();
  // const {} = useGetProject({variables: {custom_id}});
  return (
    <VStack w={"150px"} bg={"surface_container"} asChild>
      <Link
        to="/projects/$custom_id/modules/$module_id"
        params={{ custom_id, module_id: String(module.id) }}
      >
        <Text color="text" fontSize={"lg"}>
          {module.title}
        </Text>
        <Text color="text_variant" fontSize={"md"}>
          {module.status}
        </Text>
      </Link>
    </VStack>
  );
};
