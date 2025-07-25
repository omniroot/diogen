// src/routes/index.tsx
import { Modal } from "@/components/ui/modal.tsx";
import {
  Button,
  Checkbox,
  type CheckboxCheckedChangeDetails,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
  // loader: async () => await getCount(),
});

function Home() {
  const [checked, setChecked] = useState(false);

  const onChange = (event: CheckboxCheckedChangeDetails) => {
    setChecked(!!event.checked);
  };

  return (
    <VStack>
      <Text fontSize={"2xl"}>Hello world</Text>
      <Button onClick={() => alert("tete")}>click me</Button>

      <Checkbox.Root checked={checked} onCheckedChange={onChange}>
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>Accept terms and conditions</Checkbox.Label>
      </Checkbox.Root>
      <Modal trigger={<Button>Open modal</Button>}>
        <Input />
      </Modal>
    </VStack>
  );
}
