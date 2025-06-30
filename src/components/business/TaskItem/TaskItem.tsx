import { supabase } from "@/api/supabase";
import type { ITask, ITaskUpdate } from "@/api/supabase.interface";
import { Button, Checkbox, HStack, IconButton, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { LuTrash } from "react-icons/lu";
import styles from "./TaskItem.module.css";
import { useGetProject } from "@/api/queries/projects.api";
import { useGlobalStore } from "@/stores/global.store";

interface ITaskItemProps {
  task: ITask;
}

export const TaskItem: FC<ITaskItemProps> = ({ task }) => {
  const [checked, setChecked] = useState(task.completed);
  const { project_id } = useGlobalStore();
  const { data: project } = useGetProject({ variables: { id: project_id } })
  const { mutate: updateTask } = useMutation<
    ITask | undefined,
    unknown,
    boolean
  >({
    mutationKey: ["update-task", task.id],
    mutationFn: async (variable) => {
      const newTask: ITaskUpdate = {
        completed: variable,
      };
      const { data } = await supabase
        .from("tasks")
        .update(newTask)
        .eq("id", task.id)
        .select();
      return data?.[0];
    },
  });

  const onTaskClick = () => {
    // setChecked(prev => !prev)
  };

  const onTaskChecked = () => {
    const nextState = !checked;
    setChecked(nextState);
    updateTask(nextState);
  };

  return (
    <HStack
      w="100%"
      justifyContent={"space-between"}
      onClick={onTaskClick}
      p="8px"
      borderRadius={"8px"}
      borderWidth={"2px"}
      borderColor={{
        base: "surface_container",
        _hover: "surface_container_highest",
      }}
      bg={{ base: "surface", _hover: "surface_container" }}
      cursor={"pointer"}
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
        <Button variant={"outline"} size={"xs"} w="fit-content" borderRadius={"12px"} minW={"80px"} borderColor={project?.color} borderWidth={"2px"}>{project?.title}</Button>
        <IconButton variant="outline" size={"xs"}>
          <LuTrash />
        </IconButton>
      </HStack>
    </HStack >
  );
};
