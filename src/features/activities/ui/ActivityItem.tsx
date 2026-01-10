import {
	Badge,
	CloseButton,
	Drawer,
	HStack,
	IconButton,
	Portal,
	Text,
	VStack,
} from "@chakra-ui/react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import type { Activities } from "@/api/types/appwrite.js";
import { useActivityEntries } from "@/features/activities/api/activities.api.ts";
import { ActivityEntryList } from "@/features/activities/ui/ActivityEntryList.tsx";

interface Props {
	activity: Activities;
}
export const ActivityItem: React.FC<Props> = ({ activity }) => {
	const { activityEntries } = useActivityEntries({
		activity_id: { equal: activity.$id },
	});

	// console.log(normalizeActivityEntries(activityEntries, 5));

	return (
		<Drawer.Root placement={"bottom"}>
			<Drawer.Trigger asChild>
				<HStack
					w={"100%"}
					p={3}
					bg={{ base: "surface-container", _hover: "surface-container-high" }}
					borderRadius={"21px"}
					justifyContent={"space-between"}
					css={{
						"&:hover .activity-item-type-badge": {
							bg: "{colors.surface-container-highest}",
						},
						// "&:hover .activity-entry-item": {
						// 	bg: "{colors.surface-container-highest}",
						// },
					}}
				>
					<VStack alignItems={"start"}>
						<Text fontSize={"16px"} fontWeight={"bold"}>
							{activity.title}
						</Text>
						<Badge
							bg={"surface-container-high"}
							py={1}
							px={2}
							borderRadius={"full"}
							fontSize={"14px"}
							className="activity-item-type-badge"
						>
							{activity.type}
						</Badge>
					</VStack>
					<HStack>
						{activity.type === "habit" && (
							<ActivityEntryList
								activityEntries={activityEntries}
								direction={"horizontal"}
								length={5}
							/>
						)}
						{/* {activity.type === "habit" &&
							activityEntries &&
							normalizeActivityEntries(activityEntries, 5).map((activityEntry) => {
								return (
									<ActivityEntryItem
										key={activityEntry.$id}
										activityEntry={activityEntry}
										showDay="above"
									/>
								);
							})} */}
						{/* <Badge
					bg={"surface-container-high"}
					py={1}
					px={2}
					borderRadius={"full"}
					fontSize={"14px"}
					className="activity-item-type-badge"
				>
					{activityEntries?.length}
				</Badge> */}
					</HStack>
				</HStack>
			</Drawer.Trigger>
			<Portal>
				<Drawer.Backdrop backdropFilter={"blur(var(--chakra-blurs-sm))"} />
				<Drawer.Positioner>
					<Drawer.Content bg={"surface"} borderRadius={"2xl"}>
						<Drawer.Header>
							<Drawer.Title>{activity.title}</Drawer.Title>
						</Drawer.Header>
						<Drawer.Body>
							<Text>{activity.description}</Text>

							{activity.type === "habit" && (
								<HStack w={"100%"} justifyContent={"end"}>
									<ActivityEntryList
										activityEntries={activityEntries}
										direction={"vertical"}
										length={31}
									/>
								</HStack>
							)}
						</Drawer.Body>
						<Drawer.Footer justifyContent={"space-between"}>
							<HStack>
								<IconButton variant="ghost">
									<IconTrash />
								</IconButton>
								<IconButton variant="ghost">
									<IconEdit />
								</IconButton>
							</HStack>
							<HStack>{/* <Button>Save</Button> */}</HStack>
						</Drawer.Footer>
						<Drawer.CloseTrigger asChild>
							<CloseButton size="sm" />
						</Drawer.CloseTrigger>
					</Drawer.Content>
				</Drawer.Positioner>
			</Portal>
		</Drawer.Root>
	);
};
