import { useGetTask } from "@/api/queries/tasks.api";
import { PriorityMenu } from "@/components/business/TaskItem/PriorityMenu/PriorityMenu.tsx";
import { DatePicker } from "@/components/business/TaskItem/StartDatePicker/StartDatePicker.tsx";
import { useTaskbarStore } from "@/stores/taskbar.store";
import {
  Button,
  Editable,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useKeyPress } from "@siberiacancode/reactuse";
import { LuArrowLeftToLine } from "react-icons/lu";
import { LabelMenu } from "../TaskItem/LabelMenu/LabelMenu";

export const Taskbar = () => {
  const { task_id, isOpen, toggleOpen } = useTaskbarStore();
  useKeyPress("o", (isPressed) => {
    if (isPressed) toggleOpen(!isOpen);
  });

  const { data: task, isFetching } = useGetTask({
    variables: { id: task_id },
    enabled: !!task_id,
  });

  // console.log(`@Task_id: ${task?.id},`, task);

  // if (!isOpen) return null;
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
      <HStack justifyContent={"space-between"} alignItems={"center"}>
        <IconButton variant={"ghost"} onClick={() => toggleOpen()}>
          <LuArrowLeftToLine
            style={{
              rotate: isOpen ? "0deg" : "180deg",
              transition: "rotate 250ms",
            }}
          />
        </IconButton>
        {isOpen && (
          <Skeleton loading={isFetching}>
            <Text color={"text"} fontSize={"md"} fontWeight={"bold"}>
              {task?.title}
              {!task && "Select task :)"}
            </Text>
          </Skeleton>
        )}
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
    </VStack>
  );
};
