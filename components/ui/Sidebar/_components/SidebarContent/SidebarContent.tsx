import { useColorMode } from "@/components/ui/color-mode";
import { ProjectsList } from "@/components/ui/Sidebar/_components/ProjectsList/ProjectsList";
import { HStack, IconButton, Link, Text, VStack } from "@chakra-ui/react";
import { FC, ReactNode } from "react";
import { LuCalendar, LuPlus, LuSettings2 } from "react-icons/lu";
interface ISidebarContentProps {
  children?: ReactNode;
}
export const SidebarContent: FC<ISidebarContentProps> = () => {
  const { colorMode } = useColorMode();

  console.log({ colorMode });

  return (
    <VStack w={"100%"} h={"100%"} alignItems={"flex-start"}>
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
        <Link color={"text"} href={`/calendar/`} textDecoration={"none"}>
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
