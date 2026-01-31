import { Badge, Checkbox, Heading, HStack, VStack } from "@chakra-ui/react";
import { IconRepeat } from "@tabler/icons-react";
import type { Activities } from "@/api/types/appwrite.js";
import { useActivityEntries } from "@/features/activities/api/activity-entries.api.ts";
import { useApp } from "@/hooks/useApp.tsx";

interface Props {
	activity: Activities;
}
export const ActivityTaskItem: React.FC<Props> = ({ activity }) => {
	const { selectedDate } = useApp();
	const { activityEntries } = useActivityEntries({
		date: { equal: selectedDate },
		activity_id: { equal: activity.$id },
	});
	const activityEntry = activityEntries?.[0];
	return (
		<HStack w={"100%"} justifyContent={"space-between"} bg={"surface-container"} p={3}>
			<VStack w={"100%"} alignItems={"start"} gap={"4px"}>
				<Heading fontSize={"16px"}>{activity.title}</Heading>
				<Badge
					color={"on-surface-darkest"}
					bg={"surface-container-high"}
					fontSize={"16px"}
					fontWeight={"medium"}
					borderRadius={"full"}
					px={"6px"}
					py={"4px"}
					_icon={{ w: "16px", h: "16px" }}
				>
					<IconRepeat />
					{activity.type}
				</Badge>
			</VStack>
			<HStack justifyContent={"end"}>
				<Checkbox.Root checked={activityEntry?.completed}>
					<Checkbox.HiddenInput />
					<Checkbox.Control
						w={"28px"}
						h={"28px"}
						borderColor={"outline"}
						_checked={{ border: "transparent", borderRadius: "8px" }}
					/>
				</Checkbox.Root>
			</HStack>
		</HStack>
	);
};
