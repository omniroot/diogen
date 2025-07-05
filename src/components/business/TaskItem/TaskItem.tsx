import {
  useDeleteTask,
  useGetTasks,
  useUpdateTask,
} from "@/api/queries/tasks.api.ts";
import { client } from "@/api/query.client.ts";
import type { ITask } from "@/api/supabase.interface";
import { Checkbox, HStack, IconButton, Text } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { type FC, useState } from "react";
import { LuTrash } from "react-icons/lu";
import styles from "./TaskItem.module.css";

interface ITaskItemProps {
  task: ITask;
}

export const TaskItem: FC<ITaskItemProps> = ({ task }) => {
  const [checked, setChecked] = useState(task.completed);
  // const { project_id } = useGlobalStore();
  // const { data: project } = useGetProject({ variables: { id: project_id } });
  const { mutate: deleteTask } = useDeleteTask({
    onSuccess: () => {
      client.refetchQueries({ queryKey: useGetTasks.getKey() });
    },
  });
  const { mutate: updateTask } = useUpdateTask();

  const onDeleteTaskClick = () => {
    // event.stopPropagation();
    deleteTask({ id: task.id });
  };

  const onTaskChecked = () => {
    // event.stopPropagation();
    const nextState = !checked;
    setChecked(nextState);
    updateTask({ id: task.id, data: { completed: nextState } });
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
    <HStack
      w="100%"
      justifyContent={"space-between"}
      // onClick={onTaskClick}
      p="8px"
      borderRadius={"8px"}
      borderWidth={"2px"}
      borderColor={{
        base: "surface_container",
        _hover: "surface_container_highest",
      }}
      bg={{ base: "surface", _hover: "surface_container" }}
      cursor={"pointer"}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      // draggable
    >
      <HStack>
        <Checkbox.Root
          checked={checked}
          onChange={onTaskChecked}
          variant={"solid"}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control cursor={"pointer"} colorPalette={"orange"} />
        </Checkbox.Root>
        <Text color={"text_variant"}>{task.id}</Text>
        <Text color="text">{task.title}</Text>
      </HStack>
      <HStack className={styles.actions}>
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
        <IconButton variant="ghost" size={"xs"} onClick={onDeleteTaskClick}>
          <LuTrash />
        </IconButton>
      </HStack>
    </HStack>
  );
};
