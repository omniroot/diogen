import {
	Badge,
	CloseButton,
	Drawer,
	HStack,
	IconButton,
	Portal,
	Text,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import type { Activities } from "@/api/types/appwrite.d.ts";
import { useActivityEntries } from "@/features/activities/api/activity-entries.api.ts";
import { ActivityEntryList } from "@/features/activities/ui/ActivityEntryList.tsx";
import { useApp } from "@/hooks/useApp.tsx";
import { useDrawers } from "@/hooks/useDrawers.tsx";

interface Props {
	activity: Activities;
}
export const ActivityItem: React.FC<Props> = ({ activity }) => {
	const { open, setOpen } = useDisclosure();
	const { setSelectedActivity } = useApp();
	const { activityEntries } = useActivityEntries({
		activity_id: { equal: activity.$id },
	});

	const { toggle } = useDrawers("activity");

	useEffect(() => {
		if (open) {
			setSelectedActivity(activity);
		}
		return () => setSelectedActivity(null);
	}, [open, setSelectedActivity, activity, activity.$id]);
	// console.log(normalizeActivityEntries(activityEntries, 5));

	// write anything
	// TODO: refactoring this component

	return (
		<Drawer.Root placement={"bottom"} open={open} onOpenChange={(v) => setOpen(v.open)}>
			<Drawer.Trigger asChild>
				<HStack
					w={"100%"}
					p={3}
					bg={{ base: "surface-container", _hover: "surface-container-high" }}
					borderRadius={"21px"}
					justifyContent={"space-between"}
					className="activity-item"
					css={
						{
							// "&:hover .activity-item-type-badge": {},
							// "&:hover .activity-entry-item": {
							// 	bg: "{colors.surface-container-highest}",
							// },
						}
					}
				>
					<VStack alignItems={"start"}>
						<Text fontSize={"16px"} fontWeight={"bold"}>
							{activity.title}
						</Text>
						{/* <Text>{activity.}</Text> */}
						<Badge
							bg={"surface-container-high"}
							py={1}
							px={2}
							borderRadius={"full"}
							fontSize={"14px"}
							css={{
								".activity-item:hover &": {
									bg: "{colors.surface-container-highest}",
								},
							}}
						>
							{activity.type}
						</Badge>
					</VStack>
					<HStack justifyContent={"end"}>
						{activity.type === "habit" && (
							<ActivityEntryList
								activity_id={activity.$id}
								activityEntries={activityEntries}
								direction={"horizontal"}
								length={4}
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
							<VStack alignItems={"start"}>
								<Text>{activity.description}</Text>

								{activity.type === "habit" && (
									<ActivityEntryList
										activity_id={activity.$id}
										activityEntries={activityEntries}
										direction={"vertical"}
										length={42}
										size="md"
									/>
								)}
							</VStack>
						</Drawer.Body>
						<Drawer.Footer justifyContent={"space-between"}>
							<HStack>
								<IconButton
									variant="ghost"
									onClick={() => {
										// setOpen(false);
										toggle("delete", "replace");
									}}
								>
									<IconTrash />
								</IconButton>
								<IconButton
									variant="ghost"
									onClick={() => {
										// setOpen(false);
										toggle("update", "replace");
									}}
								>
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
