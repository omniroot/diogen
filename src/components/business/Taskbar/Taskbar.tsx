import { useGetTask } from "@/api/queries/tasks.api";
import { DatePicker } from "@/components/business/TaskItem/DatePicker/DatePicker";
import { PriorityMenu } from "@/components/business/TaskItem/PriorityMenu/PriorityMenu.tsx";
import { useTaskbarStore } from "@/stores/taskbar.store";
import {
  Button,
  CloseButton,
  Drawer,
  Editable,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Portal,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useKeyPress, useMediaQuery } from "@siberiacancode/reactuse";
import { useLocation } from "@tanstack/react-router";
import { LuArrowLeftToLine } from "react-icons/lu";
import { LabelMenu } from "../TaskItem/LabelMenu/LabelMenu";

export const Taskbar = () => {
  const { search }: { search: { modal: boolean } } = useLocation();
  const isMobile = useMediaQuery("(max-width: 924px)");

  console.log({ isMobile });

  const { task_id, isOpen, toggleOpen } = useTaskbarStore();
  useKeyPress("o", (isPressed) => {
    if (!search.modal) {
      if (isPressed) toggleOpen(!isOpen);
    }
  });

  const { data: task, isFetching } = useGetTask({
    variables: { id: task_id },
    enabled: !!task_id,
  });

  const content = (
    <>
      <HStack w="100%" justifyContent={"space-between"} alignItems={"center"}>
        {isOpen && (
          <Skeleton loading={isFetching}>
            <Text color={"text"} fontSize={"md"} fontWeight={"bold"}>
              {task?.title}
              {!task && "Select task :)"}
            </Text>
          </Skeleton>
        )}
        <IconButton variant={"ghost"} onClick={() => toggleOpen()}>
          <LuArrowLeftToLine
            style={{
              rotate: isOpen ? "0deg" : "180deg",
              transition: "rotate 250ms",
            }}
          />
        </IconButton>
      </HStack>
      <VStack w="100%" alignItems={"flex-start"} gap={"12px"} hidden={!isOpen}>
        {task && (
          <>
            <Skeleton loading={isFetching} w="100%">
              <Editable.Root
                w="100%"
                color={"text_variant"}
                defaultValue={task?.description || ""}
                placeholder={"Description..."}
              >
                <Editable.Preview w="100%" />
                <Editable.Textarea w="100%" minH={"180px"} />
              </Editable.Root>
            </Skeleton>
            <HStack>
              <Text fontWeight={"bold"}>Label:</Text>
              <LabelMenu task={task} />
            </HStack>

            <HStack>
              <Text fontWeight={"bold"}>Priority:</Text>
              <PriorityMenu task={task} />
            </HStack>

            <HStack>
              <Text fontWeight={"bold"}>Date:</Text>
              <DatePicker task={task} type="start" />
              <DatePicker task={task} type="end" />
            </HStack>

            <Text fontSize={"lg"} fontWeight={"bold"}>
              Options:
            </Text>
            <Grid templateColumns={"repeat(3, 1fr)"} gap={"8px"}>
              <GridItem>
                <Skeleton loading={isFetching}>
                  <Button colorPalette={"red"} variant={"solid"}>
                    Delete
                  </Button>
                </Skeleton>
              </GridItem>
              <GridItem>
                <Skeleton loading={isFetching}>
                  <Button>Share</Button>
                </Skeleton>
              </GridItem>

              <GridItem>
                <Skeleton loading={isFetching}>
                  <Button>Copy</Button>
                </Skeleton>
              </GridItem>
            </Grid>
          </>
        )}
      </VStack>
    </>
  );

  // console.log(`@Task_id: ${task?.id},`, task);

  // if (!isOpen) return null;

  if (isMobile && isOpen) {
    return (
      <Drawer.Root
        placement={"bottom"}
        open={isOpen}
        defaultOpen
        onOpenChange={(e) => toggleOpen(!isOpen)}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>{task?.title}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>{content}</Drawer.Body>
              <Drawer.Footer>
                <Drawer.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Drawer.ActionTrigger>
                <Button>Save</Button>
              </Drawer.Footer>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    );
  } else {
    return (
      <VStack
        alignItems={"flex-start"}
        gap={"12px"}
        w={isOpen ? "500px" : "80px"}
        h={isOpen ? "95dvh" : "70px"}
        bg={"surface_container"}
        p={"12px"}
        borderWidth={"2px"}
        borderRadius={"24px"}
        borderColor={"surface_container_highest"}
        transition={"width 200ms, height 200ms"}
        key={task?.id}
        // hidden={!isOpen}
      >
        desktop
        {content}
      </VStack>
    );
  }
};
