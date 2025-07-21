import { Button, Menu, Portal, Skeleton } from "@chakra-ui/react";
import { FC } from "react";
import Calendar from "react-calendar";
import "./DatePicker.css";
import {
  useGetTask,
  useGetTasks,
  useUpdateTask,
} from "@/api/queries/tasks.api.ts";
import { client } from "@/api/query.client.ts";
import { ITask } from "@/api/supabase.interface.ts";
import { format } from "date-fns";

interface IProps {
  task: ITask | undefined;
  isShow?: boolean;
  type: "start" | "end";
}

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return "";
  return format(date, "dd MMM");
};

export const DatePicker: FC<IProps> = ({ task, type, isShow = true }) => {
  const { mutate: updateTask } = useUpdateTask({
    onSuccess: () => {
      client.refetchQueries({ queryKey: useGetTasks.getKey() });
      client.refetchQueries({ queryKey: useGetTask.getKey({ id: task?.id }) });
    },
  });
  const onDayClick = (date: Date) => {
    if (task)
      updateTask({
        id: task.id,
        data: {
          [type === "start" ? "start_date" : "end_date"]: date.toDateString(),
        },
      });
  };

  if (!isShow) return null;

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Skeleton loading={!task}>
          <Button
            variant="outline"
            size="sm"
            borderWidth={"2px"}
            borderColor={
              {
                // base: getTaskColor(task.priority as IPriority),
              }
            }
            borderRadius={"full"}
            hidden={!isShow}
          >
            {!task?.start_date &&
              !task?.end_date &&
              (type === "start" ? "startDate" : "endDate")}
            {type === "start"
              ? formatDate(task?.start_date)
              : formatDate(task?.end_date)}
          </Button>
        </Skeleton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Calendar onClickDay={onDayClick} />
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};
