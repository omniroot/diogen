import { Sidebar } from "@/components/business/Sidebar/Sidebar.tsx";
import { useMedia } from "@/hooks/useMedia.tsx";
import { useGlobalStore } from "@/stores/global.store.ts";
import { useHeader } from "@/stores/header.store.ts";
import { Float, Spacer, Text, VStack } from "@chakra-ui/react";

import { Breadcrumbs } from "@/components/ui/Breadcrumbs.tsx";
import { useLocation } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Taskbar } from "../business/Taskbar/Taskbar";
import { Toaster } from "@/components/ui/toaster.tsx";

export const GlobalLayout = ({ children }: { children: ReactNode }) => {
  const path = useLocation().href;
  const { project_id, module_id } = useGlobalStore();
  const { isMobile, isTablet } = useMedia();
  const { toggleIsCollapsed } = useHeader();

  console.log({ isMobile });

  console.log({ path });

  useEffect(() => {
    if (isMobile || isTablet) {
      toggleIsCollapsed(true);
    }
  }, [path]);

  return (
    <>
      <Toaster />
      <Sidebar />
      <VStack w="100%">
        <Breadcrumbs />
        <main className="main">{children}</main>
      </VStack>
      <Taskbar />
      <Float
        pos={"fixed"}
        top={"unset"}
        bottom={"45px"}
        right={"120px"}
        p="12px"
        color={"text"}
        bg="surface_container"
        borderWidth={"2px"}
        borderColor={"outline_variant"}
        borderRadius={"12px"}
      >
        <Text>Project: {project_id}</Text>
        <Spacer w={"8px"} />
        <Text>Module: {module_id}</Text>
      </Float>
    </>
  );
};
