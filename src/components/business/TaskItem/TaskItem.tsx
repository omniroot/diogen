import { useGetProject } from "@/api/queries/projects.api";
import {
  useDeleteTask,
  useGetTasks,
  useUpdateTask,
} from "@/api/queries/tasks.api.ts";
import { client } from "@/api/query.client.ts";
import type { ITask } from "@/api/supabase.interface";
import { useGlobalStore } from "@/stores/global.store";
import { Button, Checkbox, HStack, IconButton, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { type FC, useState } from "react";
import { LuTrash } from "react-icons/lu";
import styles from "./TaskItem.module.css";

interface ITaskItemProps {
  task: ITask;
}

export const TaskItem: FC<ITaskItemProps> = ({ task }) => {
  const [checked, setChecked] = useState(task.completed);
  const { project_id } = useGlobalStore();
  const { data: project } = useGetProject({ variables: { id: project_id } });
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

  const onTaskChecked = (event: React.FormEvent<HTMLLabelElement>) => {
    event.stopPropagation();
    const nextState = !checked;
    setChecked(nextState);
    updateTask({ id: task.id, data: { completed: nextState } });
  };

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
      asChild
    >
      <Link to="/tasks/$task_id" params={{ task_id: String(task?.id) }}>
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
          <Button
            variant={"outline"}
            size={"xs"}
            w="fit-content"
            borderRadius={"12px"}
            minW={"80px"}
            borderColor={project?.color}
            borderWidth={"2px"}
          >
            {project?.title}
          </Button>
          <IconButton variant="outline" size={"xs"} onClick={onDeleteTaskClick}>
            <LuTrash />
          </IconButton>
        </HStack>
      </Link>
    </HStack>
  );
};
