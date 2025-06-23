"use client";
import { supabase } from "@/api/supabase";
import { ActionIcon, Button, Checkbox, Group, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import { TaskItem } from "@/app/projects/[custom_id]/_components/TaskItem/TaskItem";
import { TaskList } from "@/app/projects/[custom_id]/_components/TaskList/TaskList";

interface IParams {
  custom_id: string;
  [key: string]: string | string[] | undefined;
}

export default function ProjectPage({}: {}) {
  const { custom_id } = useParams<IParams>();
  const {
    data: project,
    isFetching: projectIsFetching,
    isSuccess: projectIsSuccess,
  } = useQuery({
    queryKey: ["get-project", custom_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("custom_id", custom_id);
      return data?.[0];
    },
    retryDelay: 20000, // Настраиваем задержку перед повторной попыткой (в миллисекундах)
    staleTime: 5 * 60 * 1000, // Время, в течение которого данные считаются свежими
  });

  console.log({ project });

  if (projectIsFetching) return "Loading...";
  if (!project) return "Not found";

  return (
    <>
      <div className={styles.project_info}>
        <Group>
          <div
            className="project_circle"
            style={{ backgroundColor: project.color }}
          ></div>
          <Text fz={"h1"} fw={"bold"}>
            {project.title}
          </Text>
        </Group>

        <Text fz={"h3"}>{project.description}</Text>
      </div>

      <div className={styles.item}>
        <div className={styles.content}>
          <Text fz={"h2"} fw={"bold"}>
            Tasks
          </Text>
        </div>
        <div className={styles.actions}>
          <Button>Create task</Button>
          {/* <ActionIcon size={"md"} c={"dark.2"} variant="transparent">
            <PlusIcon />
          </ActionIcon> */}
        </div>
      </div>
      <TaskList project={project} />
    </>
  );
}
