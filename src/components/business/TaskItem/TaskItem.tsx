import { supabase } from "@/api/supabase";
import { ITask, ITaskUpdate } from "@/api/supabase.interface";
import { Checkbox, IconButton, Text } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { FC, useState } from "react";
import { LuTrash } from "react-icons/lu";
import styles from "./TaskItem.module.css";

interface ITaskItemProps {
  task: ITask;
}

export const TaskItem: FC<ITaskItemProps> = ({ task }) => {
  const [checked, setChecked] = useState(task.completed);
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
    <div className={styles.task_item} onClick={onTaskClick}>
      <div className={styles.content}>
        <Checkbox.Root
          checked={checked}
          onChange={onTaskChecked}
          variant={"solid"}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
        <Text color={"text_variant"}>{task.id}</Text>
        <Text color="text">{task.title}</Text>
      </div>
      <div className={styles.actions}>
        <IconButton variant="outline">
          <LuTrash />
        </IconButton>
      </div>
    </div>
  );
};
