import type { Activities } from "@/api/types/appwrite.d.ts";
import type { DomainHookMultiple } from "@/api/utils/appwrite.utils.tsx";
import { useActivities } from "@/features/activities/api/activities.api.ts";
import { ActivityItem } from "@/features/activities/ui/ActivityItem.tsx";
import { KaizenList } from "@/theme/ui/KaizenList.tsx";

interface Props {
	queries?: DomainHookMultiple<Activities>["queries"];
}
export const ActivityList: React.FC<Props> = ({ queries = {} }) => {
	const { activities } = useActivities({ type: "list", queries });

	return (
		// <VStack
		// 	w={"100%"}
		// 	alignItems={"start"}
		// 	gap={1}
		// 	transition={"gap 200ms"}
		// 	css={{
		// 		"& > *": {
		// 			borderRadius: "0px",
		// 		},
		// 		"&:has(:active)": {
		// 			gap: "0",
		// 		},
		// 		"& > *:first-child": {
		// 			borderTopLeftRadius: "21px",
		// 			borderTopRightRadius: "21px",
		// 		},
		// 		"& > *:last-child": {
		// 			borderBottomLeftRadius: "21px",
		// 			borderBottomRightRadius: "21px",
		// 		},
		// 	}}
		// >
		<KaizenList.Root>
			{activities?.map((activity) => {
				return (
					<KaizenList.Item key={activity.$id} asChild>
						{/* <KaizenList.Content> */}
						<ActivityItem activity={activity} />
						{/* </KaizenList.Content> */}
					</KaizenList.Item>
				);
			})}
		</KaizenList.Root>
	);
};
