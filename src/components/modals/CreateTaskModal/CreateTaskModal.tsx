import { useCreateTask, useGetTasks } from "@/api/queries/tasks.api.ts";
import { client } from "@/api/query.client.ts";
import { toaster } from "@/components/ui/toaster.tsx";
import { useGlobalStore } from "@/stores/global.store.ts";
import {
  Button,
  Dialog,
  Field,
  HStack,
  Input,
  Kbd,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useKeyPress } from "@siberiacancode/reactuse";
import {
  getRouteApi,
  useLocation,
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";
import { title } from "process";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";

interface IFormValues {
  title: string;
  description: string;
}

export const CreateTaskModal = () => {
  const navigate = useNavigate({ from: "/" });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  useKeyPress("n", () => {
    setOpen(true);
  });
  const {
    getValues,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormValues>();
  const { project_id, module_id } = useGlobalStore();
  const { mutate: createTask } = useCreateTask({
    onSuccess: () => {
      client.refetchQueries({ queryKey: useGetTasks.getKey() });
      const newTask = getValues();
      toaster.create({
        title: `Task ${newTask.title} created`,
        type: "success",
      });
      setOpen(false);
      reset();
    },
    onError: (error) => {
      const newTask = getValues();

      toaster.create({
        title: `Task ${newTask.title} create failed!`,
        type: "error",
      });
      setError(error.message);
    },
  });

  console.log({ errors });

  useEffect(() => {
    if (open) {
      navigate({
        search: {
          modal: true,
        },
      });
    } else {
      navigate({
        search: {},
      });
    }
  }, [open]);

  const onSubmit = (values: IFormValues) => {
    createTask(
      {
        title: values.title,
        description: values.description,
        module_id,
        project_id,
      },
      {}
    );
  };

  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button variant={"outline"} size={{ base: "md" }}>
          <LuPlus />
          Create task
          <Kbd>n</Kbd>
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title>Create task</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4">
                <Stack gap="4">
                  <Field.Root required invalid={!!errors.title}>
                    <Field.Label>
                      Title
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <Input
                      placeholder="Title"
                      {...register("title", { required: true })}
                    />
                    <Field.ErrorText>{!errors.title?.message}</Field.ErrorText>
                  </Field.Root>
                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <Input
                      placeholder="Description"
                      {...register("description")}
                    />
                  </Field.Root>
                  {error && (
                    <HStack>
                      {/* <Text>Error:</Text> */}
                      <Text color={"red.600"}>{error}</Text>
                    </HStack>
                  )}
                </Stack>
              </Dialog.Body>
              <Dialog.Footer justifyContent={"space-between"}>
                <Dialog.ActionTrigger asChild>
                  <Button bg={"red.500"}>Cancel</Button>
                </Dialog.ActionTrigger>
                {/* <Dialog.ActionTrigger asChild> */}
                <Button color={"black"} fontWeight={"bold"} type="submit">
                  Create
                </Button>
                {/* </Dialog.ActionTrigger> */}
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
