import { useCanGoForward } from "@/hooks/useCanGoForward.tsx";
import { HStack, IconButton, Separator } from "@chakra-ui/react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconEdit,
  IconSearch,
} from "@tabler/icons-react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";

export const SidebarHeader = () => {
  const canGoBack = useCanGoBack();
  const canGoForward = useCanGoForward();
  const { history } = useRouter();

  return (
    <HStack
      w="100%"
      justify="space-between"
      // p="12px 6px"
      // borderBottom={"2px solid"}
      // borderColor={"colors.outline"}
    >
      <HStack gap="8px" alignItems={"center"}>
        <div
          style={{
            width: "32px",
            height: "32px",
            backgroundColor: "red",
            borderRadius: "50%",
          }}
        ></div>
        <span>Diogen</span>
      </HStack>
      <HStack gap="4px" alignItems={"center"}>
        <IconButton
          size="sm"
          variant="ghost"
          onClick={() => history.back()}
          disabled={!canGoBack}
        >
          <IconArrowNarrowLeft />
        </IconButton>
        <IconButton
          size="sm"
          variant="ghost"
          onClick={() => history.forward()}
          disabled={!canGoForward}
        >
          <IconArrowNarrowRight />
        </IconButton>
        <Separator orientation="vertical" w={"2px"} h={"20px"} />
        <IconButton variant="ghost" color={"subtext"}>
          <IconSearch />
        </IconButton>
        <IconButton>
          <IconEdit />
        </IconButton>
      </HStack>
    </HStack>
  );
};

// export const SidebarHeader = React.memo(_SidebarHeader);
