import { Box } from "@chakra-ui/react";
import type { FC } from "react";

interface IProjectCircleProps {
	color?: string | undefined;
	variant?: "outline" | "filled";
}
export const ProjectCircle: FC<IProjectCircleProps> = ({ variant = "outline", color }) => {
	return (
		<Box
			w="15px"
			h="15px"
			borderRadius={"50%"}
			bg={variant === "filled" ? color : "transparent"}
			border={variant === "outline" ? `2px solid ${color}` : "transparent"}
			transition={"border 100ms, background 100ms"}
		></Box>
	);
};
