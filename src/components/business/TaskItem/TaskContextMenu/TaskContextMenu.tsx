import { useGetModules } from "@/api/queries/modules.api.ts";
import { useGetProjects } from "@/api/queries/projects.api.ts";
import { useGetTasks, useUpdateTask } from "@/api/queries/tasks.api.ts";
import { client } from "@/api/query.client.ts";
import { ITask } from "@/api/supabase.interface.ts";
import { toaster } from "@/components/ui/toaster.tsx";
import { useGlobalStore } from "@/stores/global.store.ts";
import { Menu, Portal } from "@chakra-ui/react";
import { FC } from "react";
import { LuChevronRight } from "react-icons/lu";

const getGitCommitName = (task: ITask) => {
  return `${task.custom_id}-${task.title.toLowerCase().replaceAll(" ", "-")}`;
};

interface IProps {
  task: ITask;
}
export const TaskContextMenu: FC<IProps> = ({ task }) => {
  const { project_id } = useGlobalStore();
  const { data: projects } = useGetProjects({ variables: {} });
  const { data: modules } = useGetModules({ variables: { project_id } });
  const { mutate: updateTask } = useUpdateTask({
    onSuccess: () => {
      client.refetchQueries({ queryKey: useGetTasks.getKey() });
    },
  });

  return (
    <>
      <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
        <Menu.TriggerItem>
          Move to <LuChevronRight />
        </Menu.TriggerItem>
        <Portal>
          <Menu.Positioner>
            <Menu.Content>
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>Projects</Menu.ItemGroupLabel>
              </Menu.ItemGroup>
              {projects?.map((project) => (
                <Menu.Item
                  value={`project-${project.id}`}
                  key={`project-${project.id}`}
                  onSelect={() =>
                    updateTask({
                      id: task.id,
                      data: { project_id: project.id },
                    })
                  }
                >
                  {project.title}
                </Menu.Item>
              ))}
              <Menu.Separator />
              <Menu.ItemGroup>
                <Menu.ItemGroupLabel>Modules</Menu.ItemGroupLabel>
              </Menu.ItemGroup>
              {modules?.map((module) => (
                <Menu.Item
                  value={`module-${module.id}`}
                  key={`module-${module.id}`}
                  onSelect={() =>
                    updateTask({
                      id: task.id,
                      data: { module_id: module.id },
                    })
                  }
                >
                  {module.title}
                </Menu.Item>
              ))}
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
      <Menu.Item
        value={`copy-git-commit-name`}
        onSelect={() => {
          const gitName = getGitCommitName(task);
          navigator.clipboard.writeText(gitName);
          toaster.create({
            title: "Git name copied",
            description: gitName,
          });
        }}
        // onSelect={() => alert(getGitCommitName(task))}
      >
        Copy git commit name
      </Menu.Item>
    </>
  );
};
