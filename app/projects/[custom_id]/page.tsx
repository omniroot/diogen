"use client";

import { useGetProject } from "@/api/queries/projects.api";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";
import { TasksList } from "@/components/business/TaskList/TaskList";

interface IParams {
  custom_id: string;
  [key: string]: string | string[] | undefined;
}

export default function ProjectPage() {
  const { custom_id } = useParams<IParams>();
  const { data: project, isFetching: projectIsFetching } = useGetProject({
    variables: { custom_id },
  });

  if (projectIsFetching) return "Loading...";
  if (!project) return "Not found";

  return (
    <>
      <VStack w="100%" bg={"surface_container"} p="12px" borderRadius={"24px"}>
        <HStack w="100%">
          <div
            className="project_circle"
            style={{ backgroundColor: project.color }}
          ></div>
          <Text as={"h1"} fontWeight={"bold"} color={"text"}>
            {project.title}
          </Text>
        </HStack>

        <HStack w="100%">
          <Text as={"h3"} color={"text_variant"}>
            {project.description}
          </Text>
        </HStack>
      </VStack>

      <div className={styles.item}>
        <div className={styles.content}>
          <Text as={"h2"} fontWeight={"bold"}>
            Tasks
          </Text>
        </div>
        <div className={styles.actions}>
          <Button>Create task</Button>
        </div>
      </div>
      <TasksList project={project} />
    </>
  );
}
