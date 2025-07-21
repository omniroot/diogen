import { useGetModules } from "@/api/queries/modules.api.ts";
import { useGetProjects } from "@/api/queries/projects.api.ts";
import {
  useDeleteTask,
  useGetTasks,
  useUpdateTask,
} from "@/api/queries/tasks.api.ts";
import { client } from "@/api/query.client.ts";
import { ITask } from "@/api/supabase.interface.ts";
import { toaster } from "@/components/ui/toaster.tsx";
import { useGlobalStore } from "@/stores/global.store.ts";
import {
  Button,
  CloseButton,
  Dialog,
  Menu,
  Portal,
  Text,
} from "@chakra-ui/react";
import { FC } from "react";
import { LuChevronRight } from "react-icons/lu";

const getGitCommitName = (task: ITask) => {
  return `${task.custom_id}-${task.title.toLowerCase().replaceAll(" ", "-")}`;
};

interface IItem {
  title: string;
  value: string;
  color: string;
}

const labelItems: IItem[] = [
  { title: "Unset", value: "unset", color: "white" },
  { title: "Bug", value: "bug", color: "red.600" },
  { title: "Refactoring", value: "refactoring", color: "orange.600" },
  { title: "Feature", value: "feature", color: "purple.600" },
];

const priorityItems: IItem[] = [
  { title: "Unset", value: "unset", color: "white" },
  { title: "High", value: "high", color: "red.600" },
  { title: "Medium", value: "medium", color: "orange.600" },
  { title: "Low", value: "low", color: "blue.600" },
];

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
  const { mutate: deleteTask } = useDeleteTask({
    onSuccess: () => {
      client.refetchQueries({ queryKey: useGetTasks.getKey() });
    },
  });

  return (
    <>
      <Menu.ItemGroup>
        <Menu.ItemGroupLabel>Change</Menu.ItemGroupLabel>
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
        <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
          <Menu.TriggerItem>
            Priority <LuChevronRight />
          </Menu.TriggerItem>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {priorityItems?.map((priority) => (
                  <Menu.Item
                    value={`priority-${priority.value}`}
                    key={`priority-${priority.value}`}
                    color={priority.color}
                    onSelect={() =>
                      updateTask({
                        id: task.id,
                        data: {
                          priority:
                            priority.value === "unset" ? null : priority.value,
                        },
                      })
                    }
                  >
                    {priority.title}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
        <Menu.Root positioning={{ placement: "right-start", gutter: 2 }}>
          <Menu.TriggerItem>
            Label <LuChevronRight />
          </Menu.TriggerItem>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {labelItems?.map((label) => (
                  <Menu.Item
                    value={`label-${label.value}`}
                    key={`label-${label.value}`}
                    color={label.color}
                    onSelect={() =>
                      updateTask({
                        id: task.id,
                        data: {
                          label: label.value === "unset" ? null : label.value,
                        },
                      })
                    }
                  >
                    {label.title}
                  </Menu.Item>
                ))}
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </Menu.ItemGroup>
      <Menu.Separator />
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
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <Menu.Item
            value={`delete-dark`}
            color={"red.600"}
            bg={{ _hover: "red.900" }}
            closeOnSelect={false}
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
            Delete
          </Menu.Item>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Delete task</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text fontSize={"lg"}>
                  Are you sure to delete this task? This action cannot be
                  undone!
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button
                  colorPalette={"red"}
                  variant={"solid"}
                  onClick={() => deleteTask({ id: task.id })}
                >
                  Delete
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};
