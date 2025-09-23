import { HStack, Text } from "@chakra-ui/react";
import { IconFlag } from "@tabler/icons-react";
import { FC } from "react";

interface IPriorityBadge {
  variant: "normal" | "medium" | "critical";
}

const priorityList = [
  {
    icon: <IconFlag />,
    value: "normal",
    title: "Normal",
    bg: "#20457E80",
    color: "#6E8CEE",
  },
  {
    icon: <IconFlag />,
    value: "medium",
    title: "Medium",
    bg: "#3D2E1680",
    color: "#D8B60A",
  },
  {
    icon: <IconFlag />,
    value: "critical",
    title: "Critical",
    bg: "#3c161680",
    color: "#FF2B2B",
  },
];

export const PriorityBadge: FC<IPriorityBadge> = ({ variant }) => {
  const { title, bg, color, icon } = priorityList.filter(
    (item) => item.value === variant
  )[0];
  return (
    <HStack
      bg={bg}
      color={color}
      p={"4px 8px"}
      gap="6px"
      borderRadius={"8px"}
      fontSize={"14px"}
      alignItems={"center"}
    >
      {icon} <Text fontWeight={"600"}>{title}</Text>
    </HStack>
  );
};
