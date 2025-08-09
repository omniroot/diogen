import { useCanGoForward } from "@/hooks/useCanGoForward.tsx";
import { ButtonGroup, HStack, IconButton, Text } from "@chakra-ui/react";
import { IconArrowNarrowLeft, IconArrowNarrowRight } from "@tabler/icons-react";
import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import type { FC, ReactNode } from "react";

interface ISidebarHeaderProps {
  children?: ReactNode;
}
export const SidebarHeader: FC<ISidebarHeaderProps> = () => {
  const canGoBack = useCanGoBack();
  const canGoForward = useCanGoForward();
  const { history } = useRouter();

  // console.log({ history });

  return (
    <HStack
      w={"100%"}
      p="4px 12px"
      justifyContent={"space-between"}
      alignItems={"center"}
      // borderBottomWidth={"2px"}
      // borderColor={"outline"}
    >
      <HStack>
        <div className="project_circle"></div>
        <Text fontWeight={"bold"} fontSize={"18px"} color={"text"} asChild>
          <Link to="/">Diogen</Link>
        </Text>
      </HStack>
      <HStack>
        <ButtonGroup gap="8px">
          <IconButton
            variant={"ghost"}
            onClick={() => history.back()}
            disabled={!canGoBack}
          >
            <IconArrowNarrowLeft />
          </IconButton>
          <IconButton
            variant={"ghost"}
            onClick={() => history.forward()}
            disabled={!canGoForward}
          >
            <IconArrowNarrowRight />
          </IconButton>

          {/* <IconButton variant={"ghost"} asChild>
            <ColorModeButton variant={"outline"} p="2" />
          </IconButton> */}
        </ButtonGroup>
      </HStack>
    </HStack>
  );
};
