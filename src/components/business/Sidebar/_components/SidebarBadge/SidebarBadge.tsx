import { useGetTasksCount } from "@/api/queries/tasks.api.ts";
import { HStack, Text } from "@chakra-ui/react";

export const SidebarBadge = () => {
  const { data: tasksCount } = useGetTasksCount();

  return (
    <HStack
      w="100%"
      h="100px"
      bg={"surface_container_high"}
      borderWidth={"2px"}
      borderColor={"outline_variant"}
      borderRadius={"8px"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Text fontSize={"lg"}>Tasks: {tasksCount} / 1800</Text>
    </HStack>
  );
};
