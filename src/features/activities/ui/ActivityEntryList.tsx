import { Box, Flex } from "@chakra-ui/react";
import type { ActivityEntries } from "@/api/types/appwrite.js";
import { ActivityEntryItem } from "@/features/activities/ui/ActivityEntryItem.tsx";
import { normalizeActivityEntries } from "@/features/activities/utils/normalizeActivityEntries.ts";
import { generateUniqueId } from "@/utils/generateRandomId.tsx";

interface Props {
	activityEntries?: ActivityEntries[];
	direction?: "horizontal" | "vertical";
	length?: number;
}
export const ActivityEntryList: React.FC<Props> = ({
	activityEntries,
	direction = "horizontal",
	length = 31,
}) => {
	const normalizedActivityEntries = normalizeActivityEntries(
		activityEntries || [],
		length,
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
			px={2}
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
					<>
						{nextMonth && SpacesComponents}
						<ActivityEntryItem
							key={activityEntry.$id}
							activityEntry={activityEntry}
							showDay="inside"
						/>
					</>
				);
			})}
		</Flex>
	);
};
