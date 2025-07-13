import { SidebarContent } from "@/components/business/Sidebar/_components/SidebarContent/SidebarContent.tsx";
import { SidebarFooter } from "@/components/business/Sidebar/_components/SidebarFooter/SidebarFooter.tsx";
import { SidebarHeader } from "@/components/business/Sidebar/_components/SidebarHeader/SidebarHeader.tsx";
import { SidebarSearch } from "@/components/business/Sidebar/_components/SidebarSearch/SidebarSearch.tsx";
import { useHeader } from "@/stores/header.store";
import { Separator, VStack } from "@chakra-ui/react";

export function Sidebar() {
  const { isCollapsed } = useHeader();
  return (
    <VStack
      w={{ sm: "100%", md: "350px" }}
      h={{
        base: isCollapsed ? "76px" : "90dvh",
        // sm: isCollapsed ? "76px" : "90dvh",
        md: isCollapsed ? "76px" : "95dvh",
      }}
      // h={isCollapsed ? "76px" : "95dvh"}
      transition={"height 200ms"}
      p={"12px"}
      borderColor={"surface_container_highest"}
      borderRadius={"24px"}
      borderWidth={"2px"}
      gap={"12px"}
      bg={"surface_container"}
      // bg={"bg.subtle"}
    >
      {/* HEADER */}
      <SidebarHeader />
      {!isCollapsed && (
        <>
          <Separator w={"100%"} h={"3px"} />
          <SidebarSearch />
          <SidebarContent />
          <Separator w={"100%"} h={"3px"} />
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
