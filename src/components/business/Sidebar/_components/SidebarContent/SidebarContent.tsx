import { HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { FC, ReactNode } from "react";
import { LuCalendar, LuPlus, LuSettings2 } from "react-icons/lu";
import { ProjectsList } from "@/components/business/Sidebar/_components/ProjectsList/ProjectsList.tsx";
import { useColorMode } from "@/components/ui/color-mode";

interface ISidebarContentProps {
  children?: ReactNode;
}
export const SidebarContent: FC<ISidebarContentProps> = () => {
  const { colorMode } = useColorMode();

  console.log({ colorMode });

  return (
    <VStack
      w={"100%"}
      h={"100%"}
      alignItems={"flex-start"}
      overflowY={{ sm: "scroll" }}
    >
      <HStack w="100%" p={"12px"} justifyContent={"space-between"}>
        <HStack>
          <Text color={"text_variant"}>Menu</Text>
        </HStack>
        <HStack>
          <IconButton variant={"ghost"} color={"text_variant"} size={"xs"}>
            <LuSettings2 />
          </IconButton>
        </HStack>
      </HStack>
      <HStack
        w="100%"
        asChild
        _hover={{ bg: "surface_container_high" }}
        p="12px"
        cursor={"pointer"}
      >
        <Link color={"text"} to={`/`}>
          <LuCalendar />
          <Text fontWeight={"semibold"}>Calendar</Text>
        </Link>
      </HStack>

      {/* PROJECTS */}
      <HStack w="100%" p={"12px"} justifyContent={"space-between"}>
        <HStack>
          <Text color={"text_variant"}>Projects</Text>
        </HStack>
        <HStack>
          <IconButton variant={"ghost"} color={"text_variant"} size={"xs"}>
            <LuPlus />
          </IconButton>
        </HStack>
      </HStack>
      <ProjectsList />
    </VStack>
  );
};
