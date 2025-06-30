import { ButtonGroup, HStack, IconButton, Text } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import { LuArrowUpDown } from "react-icons/lu";
import { ColorModeButton } from "@/components/ui/color-mode";
import { useHeader } from "@/stores/header.store";
import { Link } from "@tanstack/react-router";

interface ISidebarHeaderProps {
  children?: ReactNode;
}
export const SidebarHeader: FC<ISidebarHeaderProps> = () => {
  const { toggleIsCollapsed } = useHeader();

  return (
    <HStack w={"100%"} p="4px" justifyContent={"space-between"}>
      <HStack>
        <div className="project_circle"></div>
        <Text fontWeight={"bold"} fontSize={"lg"} color={"text"} asChild>
          <Link to="/">Diogen</Link>
        </Text>
      </HStack>
      <HStack>
        <ButtonGroup>
          <IconButton variant={"outline"} onClick={toggleIsCollapsed}>
            <LuArrowUpDown />
          </IconButton>
          <IconButton variant={"outline"} asChild>
            <ColorModeButton variant={"outline"} p="2" />
          </IconButton>
        </ButtonGroup>
      </HStack>
    </HStack>
  );
};
