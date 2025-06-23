import { supabase } from "@/api/supabase";
import { IProject } from "@/api/supabase.interface";
import { TaskItem } from "@/app/projects/[custom_id]/_components/TaskItem/TaskItem";
import { Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import styles from "./TaskList.module.css";

interface ITaskListProps {
  project: IProject;
}

export const TaskList: FC<ITaskListProps> = ({ project }) => {
  const {
    data: tasks,
    isFetching: tasksIsFetching,
    isFetched: tasksIsFetched,
  } = useQuery({
    queryKey: ["get-project-tasks", project.custom_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", Number(project?.id));
      return data;
    },
    retryDelay: 20000, // Настраиваем задержку перед повторной попыткой (в миллисекундах)
    staleTime: 5 * 60 * 1000, // Время, в течение которого данные считаются свежими
  });

  return (
    <div className={styles.tasks_list}>
      {tasksIsFetching && <Text>Loading...</Text>}
      {tasksIsFetched && !tasks?.length && <Text>Tasks not found.</Text>}
      {tasksIsFetched &&
        tasks?.map((task) => {
          return <TaskItem task={task} />;
        })}
    </div>
  );
};
