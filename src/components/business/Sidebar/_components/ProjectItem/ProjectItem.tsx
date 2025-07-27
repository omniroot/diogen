import { Box, HStack, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { FC } from "react";
import type { IProject } from "@/api/supabase.interface";

interface IProps {
  project: IProject;
}

export const ProjectItem: FC<IProps> = ({ project }) => {
  return (
    <HStack
      w="100%"
      asChild
      _hover={{ bg: "surface_container_high" }}
      p="12px"
      cursor={"pointer"}
    >
      <Link
        to={`/projects/$custom_id`}
        params={{ custom_id: project.custom_id }}
      >
        <HStack>
          <Box
            padding={"5px"}
            borderWidth={"2px"}
            borderColor={project.color}
            borderRadius={"50%"}
          ></Box>
          <Text>{project.title}</Text>
        </HStack>
      </Link>
    </HStack>
  );
};
