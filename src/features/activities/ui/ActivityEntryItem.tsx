import { Box, Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import type { ActivityEntries } from "@/api/types/appwrite.js";
import { useActivityEntry } from "@/features/activities/api/activities.api.ts";

interface Props {
	activityEntry: ActivityEntries;
	showDay?: "inside" | "above";
}
export const ActivityEntryItem: React.FC<Props> = ({
	activityEntry,
	showDay = false,
}) => {
	const { $id, completed } = activityEntry;
	const { updateOrCreate } = useActivityEntry(activityEntry.$id, undefined, {
		enabled: false,
	});

	// const { mutate: upd } = useUpdateActivityEntry();

	// console.log("@what", activityEntry, activityEntry.$id);

	// console.log({ activityEntry });

	const onEntryClick = () => {
		const nextState = !completed;
		updateOrCreate({ ...activityEntry, $id, completed: nextState });
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
		<Box
			// key={activityEntry.$id}
			w={"30px"}
			h={"30px"}
			bg={completed ? "primary" : "surface-container-high"}
			borderRadius={"md"}
			position={"relative"}
			justifyContent={"center"}
			alignItems={"center"}
			as={"button"}
			className="activity-entry-item"
			onClick={onEntryClick}
			cursor={"pointer"}
		>
			<Text
				color={
					showDay === "inside"
						? completed
							? "on-primary"
							: "on-surface-darkest"
						: "on-surface"
				}
				position={showDay === "inside" ? "initial" : "absolute"}
				top={"-25px"}
				left={"50%"}
				translate={showDay === "above" ? "-50%" : "0"}
			>
				{dayjs(activityEntry.date).date()}
			</Text>
		</Box>
	);
};
