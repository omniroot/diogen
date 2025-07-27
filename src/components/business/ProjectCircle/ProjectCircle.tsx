import { Box } from "@chakra-ui/react";
import type { FC } from "react";

interface IProjectCircleProps {
  color?: string | undefined;
}
export const ProjectCircle: FC<IProjectCircleProps> = ({ color }) => {
  return (
    <Box w="20px" h="20px" borderRadius={"full"} bg={{ base: color }}></Box>
  );
};
