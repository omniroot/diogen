import { Input } from "@chakra-ui/react";

export const SidebarSearch = () => {
  return (
    <Input
      placeholder="Search"
      size={"2xl"}
      color={{ _placeholder: "text_variant" }}
      _hover={{ borderColor: "primary" }}
    />
  );
};
