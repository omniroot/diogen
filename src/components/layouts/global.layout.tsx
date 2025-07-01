import { Sidebar } from "@/components/business/Sidebar/Sidebar.tsx";
import { useMedia } from "@/hooks/useMedia.tsx";
import { useHeader } from "@/stores/header.store.ts";

import { useLocation } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

export const GlobalLayout = ({ children }: { children: ReactNode }) => {
  const path = useLocation().href;
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
      <Sidebar />
      <main className="main">{children}</main>
    </>
  );
};
