import { Button, Dialog, IconButton, Portal } from "@chakra-ui/react";
import { FC, ReactNode, useState } from "react";
import { LuX } from "react-icons/lu";
interface IModalProps {
  children?: ReactNode;
  trigger?: ReactNode;
  title?: string;
  actionTitle?: string;
}

export const Modal: FC<IModalProps> = ({
  trigger,
  children,
  title = "Title",
  actionTitle = "Create",
}) => {
  const [open, setOpen] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("@Modal submit: ", event);
  };

  return (
    <Dialog.Root
      lazyMount
      open={open}
      onOpenChange={(event) => setOpen(event.open)}
      size={{ base: "xs", md: "md", lg: "lg" }}
      placement={"center"}
    >
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={onSubmit}>
              <Dialog.Header p={"16px"}>
                <Dialog.Title fontSize={"xl"}>{title}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body p={"16px"} pb="4">
                {children}
              </Dialog.Body>
              <Dialog.Footer p={"16px"} justifyContent={"space-between"}>
                <Dialog.ActionTrigger asChild>
                  <Button bg={"red.500"}>Cancel</Button>
                </Dialog.ActionTrigger>
                <Button color={"black"} fontWeight={"bold"} type="submit">
                  {actionTitle}
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger>
                <IconButton variant={"ghost"} color={"text_variant"}>
                  <LuX />
                </IconButton>
              </Dialog.CloseTrigger>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
