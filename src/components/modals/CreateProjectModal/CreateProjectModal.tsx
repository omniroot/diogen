import {
  useCreateProject,
  useGetProjects,
} from "@/api/queries/projects.api.ts";
import { client } from "@/api/query.client.ts";
import {
  Button,
  ColorPicker,
  Dialog,
  Field,
  HStack,
  IconButton,
  Input,
  parseColor,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";

interface IFormValues {
  title: string;
  description: string;
  custom_id: string;
  color: string;
}

export const CreateProjectModal = () => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  // const { project_id, module_id } = useGlobalStore();
  const { mutate: createProject } = useCreateProject({
    onSuccess: () => {
      client.refetchQueries({ queryKey: useGetProjects.getKey() });
    },
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormValues>({
    defaultValues: {
      color: "#eb5e41",
    },
  });

  // console.log({ errors });

  const onSubmit = (values: IFormValues) => {
    createProject({
      custom_id: values.custom_id,
      title: values.title,
      description: values.description,
      color: values.color,
    });
    reset();
  };

  useEffect(() => {
    // console.log({ errors });
  }, [errors]);

  return (
    <Dialog.Root closeOnInteractOutside={!isColorPickerOpen}>
      <Dialog.Trigger asChild>
        <IconButton variant={"ghost"} color={"text_variant"} size={"xs"}>
          <LuPlus />
        </IconButton>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner pointerEvents={"none"}>
          <Dialog.Content>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Dialog.Header>
                <Dialog.Title>Create project</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb="4">
                <Stack gap="4">
                  <Field.Root required>
                    <Field.Label>
                      Custom id
                      <Field.RequiredIndicator />
                    </Field.Label>
                    <Input placeholder="Custom id" {...register("custom_id")} />
                  </Field.Root>
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
                  <Controller
                    name="color"
                    control={control}
                    render={({ field }) => (
                      <ColorPicker.Root
                        name={field.name}
                        defaultValue={parseColor(field.value)}
                        onValueChange={(e) => field.onChange(e.valueAsString)}
                        onOpenChange={(event) =>
                          setIsColorPickerOpen(event.open)
                        }
                      >
                        <ColorPicker.HiddenInput />
                        <ColorPicker.Control>
                          <ColorPicker.Input />
                          <ColorPicker.Trigger />
                        </ColorPicker.Control>
                        <Portal>
                          <ColorPicker.Positioner>
                            <ColorPicker.Content zIndex={"popover"}>
                              <ColorPicker.Area />
                              <HStack>
                                <ColorPicker.EyeDropper
                                  size="sm"
                                  variant="outline"
                                />
                                <ColorPicker.Sliders />
                              </HStack>
                            </ColorPicker.Content>
                          </ColorPicker.Positioner>
                        </Portal>
                      </ColorPicker.Root>
                    )}
                  />
                </Stack>
              </Dialog.Body>
              <Dialog.Footer justifyContent={"space-between"}>
                <Dialog.ActionTrigger asChild>
                  <Button bg={"red.500"}>Cancel</Button>
                </Dialog.ActionTrigger>
                <Dialog.ActionTrigger asChild>
                  <Button color={"black"} fontWeight={"bold"} type="submit">
                    Create
                  </Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
