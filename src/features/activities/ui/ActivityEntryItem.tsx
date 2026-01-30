import { Box, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import type { MouseEvent } from "react";
import type { ActivityEntries } from "@/api/types/appwrite.d.ts";
import { useActivityEntry } from "@/features/activities/api/activity-entries.api.ts";
import { Tooltip } from "@/theme/ui/KaizenTooltip.tsx";

interface Props {
	activity_id: string;
	size?: "sm" | "md" | "lg";
	activityEntry: ActivityEntries;
	showDay?: "inside" | "above";
}
export const ActivityEntryItem: React.FC<Props> = ({
	activity_id,
	activityEntry,
	size = "md",
	showDay = "inside",
}) => {
	const { $id, completed } = activityEntry;
	const { updateOrCreate } = useActivityEntry(activityEntry.$id, undefined, {
		enabled: false,
	});

	// const { mutate: upd } = useUpdateActivityEntry();

	// console.log("@what", activityEntry, activityEntry.$id);

	// console.log({ activityEntry });

	const onEntryClick = (event: MouseEvent<HTMLDivElement>) => {
		event.stopPropagation();
		const nextState = !completed;
		updateOrCreate({ ...activityEntry, activity_id, $id, completed: nextState });
		// upd(
		// 	{ $id, completed: nextState },
		// 	{
		// 		onSuccess: () => {
		// 			refetcher.activityEntries.list({
		// 				where: { activity_id: { equal: activityEntry.activity_id } },
		// 			});
		// 		},
		// 	},
		// );
	};

	// useEffect(() => {
	// 	if (activityEntry.completed !== completed) {
	// 		console.log("completed changed", completed);
	// 		updateOrCreate({ ...activityEntry, completed, });
	// 	}
	// }, [activityEntry, completed, updateOrCreate]);

	return (
		<Tooltip content={activity_id}>
			<Box
				// key={activityEntry.$id}
				w={size === "sm" ? "30px" : size === "md" ? "35px" : "50px"}
				h={size === "sm" ? "30px" : size === "md" ? "35px" : "50px"}
				bg={completed ? "primary" : "surface-container-high"}
				borderRadius={completed ? "lg" : "full"}
				position={"relative"}
				justifyContent={"center"}
				alignItems={"center"}
				as={"button"}
				className="activity-entry-item"
				onClick={onEntryClick}
				cursor={"pointer"}
				css={{
					".activity-item:hover &": {
						bg: completed ? "primary" : "{colors.surface-container-highest}",
					},
				}}
			>
				<Text
					color={
						showDay === "inside"
							? completed
								? "on-primary"
								: "on-surface-darkest"
							: "on-surface-darkest"
					}
					position={showDay === "inside" ? "initial" : "absolute"}
					top={"-25px"}
					left={"50%"}
					translate={showDay === "above" ? "-50%" : "0"}
				>
					{dayjs(activityEntry.date).date()}
				</Text>
			</Box>
		</Tooltip>
	);
};
