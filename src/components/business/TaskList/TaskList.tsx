import { Text } from "@chakra-ui/react";
import type { FC } from "react";
import { useGetTasks } from "@/api/queries/tasks.api";
import type { IProject } from "@/api/supabase.interface";
import { TaskItem } from "@/components/business/TaskItem/TaskItem";
import styles from "./TaskList.module.css";

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
