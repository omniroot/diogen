import { Box, Flex } from "@chakra-ui/react";
import { Fragment } from "react/jsx-runtime";
import type { ActivityEntries } from "@/api/types/appwrite.d.ts";
import { ActivityEntryItem } from "@/features/activities/ui/ActivityEntryItem.tsx";
import { normalizeActivityEntries } from "@/features/activities/utils/normalizeActivityEntries.ts";
import { useApp } from "@/hooks/useApp.tsx";
import { generateUniqueId } from "@/utils/generateRandomId.tsx";

interface Props {
	activity_id: string;
	activityEntries?: ActivityEntries[];
	direction?: "horizontal" | "vertical";
	length?: number;
}
export const ActivityEntryList: React.FC<Props> = ({
	activity_id,
	activityEntries,
	direction = "horizontal",
	length = 31,
}) => {
	const { selectedDate } = useApp();
	const normalizedActivityEntries = normalizeActivityEntries(
		activityEntries || [],
		length,
		selectedDate,
	);

	return (
		<Flex
			w={"fit-content"}
			h={direction === "horizontal" ? "fit-content" : "260px"}
			flexDirection={direction === "horizontal" ? "row" : "column"}
			justifyContent={"start"}
			flexShrink={"1"}
			alignItems={"start"}
			flexWrap={"wrap"}
			px={0}
			gap={1}
		>
			{normalizedActivityEntries.map((activityEntry, index) => {
				const prevDay = Number(normalizedActivityEntries[index - 1]?.date.split("-")[2]);
				const currentDay = Number(normalizedActivityEntries[index]?.date.split("-")[2]);
				const nextMonth = prevDay - currentDay > 3;
				const SpacesComponents = Array.from({ length: 7 }).map(() => {
					return <Box key={`space-${generateUniqueId()}`} w={"30px"} h={"30px"}></Box>;
				});
				return (
					<Fragment key={`${generateUniqueId()}-${activityEntry.$id}`}>
						{nextMonth && SpacesComponents}
						<ActivityEntryItem
							activity_id={activity_id}
							activityEntry={activityEntry}
							showDay="inside"
						/>
					</Fragment>
				);
			})}
		</Flex>
	);
};
