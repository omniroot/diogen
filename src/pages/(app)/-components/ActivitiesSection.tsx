import { Heading, VStack } from "@chakra-ui/react";
import { ActivityList } from "@/features/activities/ui/ActivityList.tsx";

export const ActivitiesSection = () => {
	// const { toggle } = useDrawers("activity");
	return (
		<VStack w={"100%"} alignItems={"start"}>
			<Heading fontSize={"18px"} color={"on-surface"}>
				Activities
			</Heading>
			<ActivityList />
			{/* <HStack w={"100%"} justifyContent={"end"}>
				<Button
					w={"fit-content"}
					color={"on-surface-dark"}
					bg={{ base: "surface-container", _hover: "surface-container-high" }}
					borderRadius={"full"}
					onClick={() => toggle("create")}
				>
					<IconPlus />
					Create activity
				</Button>
			</HStack> */}
		</VStack>
	);
};
