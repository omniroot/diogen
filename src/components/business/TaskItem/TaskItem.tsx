import {
  useDeleteTask,
  useGetTasks,
  useUpdateTask,
} from "@/api/queries/tasks.api.ts";
import { client } from "@/api/query.client.ts";
import type { ITask } from "@/api/supabase.interface";
import { LabelMenu } from "@/components/business/TaskItem/LabelMenu/LabelMenu.tsx";
import { PriorityMenu } from "@/components/business/TaskItem/PriorityMenu/PriorityMenu.tsx";
import { DatePicker } from "@/components/business/TaskItem/StartDatePicker/StartDatePicker.tsx";
import { TaskContextMenu } from "@/components/business/TaskItem/TaskContextMenu/TaskContextMenu";
import { useTaskbarStore } from "@/stores/taskbar.store";
import {
  Checkbox,
  Editable,
  EditableValueChangeDetails,
  HStack,
  IconButton,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { type FC, useState } from "react";
import { LuTrash } from "react-icons/lu";
import styles from "./TaskItem.module.css";

interface ITaskItemProps {
  task: ITask;
}

// type IPriority = null | "low" | "medium" | "high";

// const getTaskHoverColor = (priority: IPriority) => {
//   if (priority === "high") return "red.500";
//   if (priority === "medium") return "orange.500";
//   if (priority === "low") return "blue.500";
//   return "surface_container_high";
// };

export const TaskItem: FC<ITaskItemProps> = ({ task }) => {
  const [checked, setChecked] = useState(task.completed);
  const setTaskId = useTaskbarStore().setTaskId;
  const toggleTaskbar = useTaskbarStore().toggleOpen;
  // const { project_id } = useGlobalStore();
  // const { data: project } = useGetProject({ variables: { id: project_id } });
  const { mutate: deleteTask } = useDeleteTask({
    onSuccess: () => {
      client.refetchQueries({ queryKey: useGetTasks.getKey() });
    },
  });
  const { mutate: updateTask } = useUpdateTask();

  const onDeleteTaskClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    deleteTask({ id: task.id });
  };

  const onTaskChecked = () => {
    // event.stopPropagation();
    const nextState = !checked;
    setChecked(nextState);
    updateTask({ id: task.id, data: { completed: nextState } });
  };

  const onTitleChange = (value: EditableValueChangeDetails) => {
    if (value) {
      updateTask({ id: task.id, data: { title: value.value } });
    }
  };

  const onTaskClick = () => {
    setTaskId(task.id);
    toggleTaskbar(true);
  };

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `task-draggable-${task.id}`,
    data: {
      task_id: task.id,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Menu.Root>
      <Menu.ContextTrigger width="full">
        <HStack
          w="100%"
          minH={"56px"}
          justifyContent={"space-between"}
          // onClick={onTaskClick}
          p="8px"
          borderRadius={"8px"}
          borderWidth={"2px"}
          borderColor={{
            base: "surface_container",
            _hover: "surface_container_high",
            // base: getTaskColor(task.priority as IPriority),
            // _hover: getTaskHoverColor(task.priority as IPriority),
          }}
          bg={{ base: "surface", _hover: "surface_container" }}
          cursor={"pointer"}
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          style={style}
          onClick={onTaskClick}
          // draggable
        >
          <HStack onClick={(e) => e.stopPropagation()}>
            <Checkbox.Root
              checked={checked}
              onChange={onTaskChecked}
              variant={"solid"}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control cursor={"pointer"} />
            </Checkbox.Root>
            <Text color={"text_variant"}>{task.id}</Text>
            <Editable.Root
              textAlign="start"
              defaultValue={task.title}
              onValueCommit={onTitleChange}
            >
              <Editable.Preview />
              <Editable.Input color="text" />
            </Editable.Root>
          </HStack>
          <HStack
            className={styles.actions}
            onClick={(e) => e.stopPropagation()}
          >
            <DatePicker task={task} type="start" isShow={!!task.start_date} />
            <DatePicker task={task} type="end" isShow={!!task.end_date} />
            <LabelMenu task={task} isShow={!!task.label} />
            <PriorityMenu task={task} isShow={!!task.priority} />
            {/* <Button
          variant={"outline"}
          size={"xs"}
          w="fit-content"
          borderRadius={"12px"}
          minW={"80px"}
          borderColor={project?.color}
          borderWidth={"2px"}
        >
          {project?.title}
        </Button> */}

            {/* <Badge size={"lg"} variant={"solid"}></Badge> */}
            <IconButton variant="ghost" size={"xs"} onClick={onDeleteTaskClick}>
              <LuTrash />
            </IconButton>
          </HStack>
        </HStack>
      </Menu.ContextTrigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <TaskContextMenu task={task} />
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
