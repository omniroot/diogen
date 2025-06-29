import { IProject } from "@/api/supabase.interface";
import { FC } from "react";
import styles from "./TaskList.module.css";
import { useGetTasks } from "@/api/queries/tasks.api";
import { TaskItem } from "@/components/business/TaskItem/TaskItem";
import { Text } from "@chakra-ui/react";

interface ITaskListProps {
  project: IProject;
}

export const TasksList: FC<ITaskListProps> = ({ project }) => {
  const {
    data: tasks,
    isFetching: tasksIsFetching,
    isFetched: tasksIsFetched,
  } = useGetTasks({ variables: { project_id: project.id } });
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
