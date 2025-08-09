import { SidebarBadge } from "@/components/business/Sidebar/_components/SidebarBadge/SidebarBadge.tsx";
import { SidebarContent } from "@/components/business/Sidebar/_components/SidebarContent/SidebarContent.tsx";
import { SidebarFooter } from "@/components/business/Sidebar/_components/SidebarFooter/SidebarFooter.tsx";
import { SidebarHeader } from "@/components/business/Sidebar/_components/SidebarHeader/SidebarHeader.tsx";
import { SidebarSearch } from "@/components/business/Sidebar/_components/SidebarSearch/SidebarSearch.tsx";
import { useMedia } from "@/hooks/useMedia.tsx";
import { useHeader } from "@/stores/header.store";
import { Separator, VStack } from "@chakra-ui/react";

export function Sidebar() {
  const { isCollapsed } = useHeader();
  const { isMobile } = useMedia();

  return (
    <VStack
      minW={"380px"}
      h={"97.5dvh"}
      transition={"width 200ms"}
      borderColor={"outline"}
      borderRadius={"8px"}
      borderWidth={"2px"}
      padding={"12px 0px"}
      gap={"8px"}
      display={{ base: "none", md: "flex", lg: "flex" }}
    >
      {/* HEADER */}
      {!isMobile && (
        <>
          <SidebarHeader />
          <Separator w={"100%"} size={"md"} />
          <SidebarBadge />
          <SidebarSearch />
          <SidebarContent />
          <Separator w={"100%"} size={"md"} />
          <SidebarFooter />
        </>
      )}

      {/* <TextInput
        placeholder="Search"
        size="xs"
        // leftSection={<IconSearch size={12} stroke={1.5} />}
        rightSectionWidth={70}
        rightSection={<Code className={styles.searchCode}>Ctrl + K</Code>}
        styles={{ section: { pointerEvents: "none" } }}
        mb="sm"
      /> */}

      {/* MENU LIST */}
      {/* <div className={styles.item}>
        <div className={styles.content}>
          <Text fw={"bold"} c={"dark.2"}>
            Menu
          </Text>
        </div>
        <div className={styles.actions}>
          <ActionIcon size={"md"} c={"dark.2"} variant="transparent">
            <Settings2Icon />
          </ActionIcon>
        </div>
      </div>
      <NavLink
        href="/today"
        component={Link}
        label="Today"
        leftSection={<CalendarIcon />}
        p={"xs"}
      />
      <NavLink
        href="/tasks"
        component={Link}
        label="Tasks"
        leftSection={<ListTodoIcon />}
        p={"xs"}
      /> */}
      {/* <Space /> */}
    </VStack>
  );
}
