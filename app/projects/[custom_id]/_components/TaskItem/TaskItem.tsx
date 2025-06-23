"use client";
import { ReactNode, FC, useState } from "react";
import styles from "./TaskItem.module.css";
import { ITask, ITaskUpdate } from "@/api/supabase.interface";
import { Checkbox, ActionIcon, Text } from "@mantine/core";
import { TrashIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/api/supabase";

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
        <Checkbox checked={checked} onChange={onTaskChecked} />
        <Text c={"dark.3"}>{task.id}</Text>
        <Text>{task.title}</Text>
      </div>
      <div className={styles.actions}>
        <ActionIcon variant="transparent">
          <TrashIcon />
        </ActionIcon>
      </div>
    </div>
  );
};
