import { HStack, Text, VStack } from "@chakra-ui/react";

interface ISection {
  title?: string;
  actionsSlot?: React.ReactNode;
  children?: React.ReactNode;
}

export const Section: React.FC<ISection> = ({
  title = "Title",
  actionsSlot,
  children,
}) => {
  return (
    <VStack w={"100%"} alignItems={"start"} p={2}>
      <HStack w={"100%"} justifyContent={"space-between"}>
        <HStack>
          <Text fontSize={"lg"} fontWeight={"bold"}>
            {title}
          </Text>
        </HStack>
        <HStack>{actionsSlot}</HStack>
      </HStack>
      <VStack w={"100%"} alignItems={"start"}>
        {children}
      </VStack>
    </VStack>
    // <HStack  justifyContent={"space-between"} p={2}>
    // </HStack>
  );
};
