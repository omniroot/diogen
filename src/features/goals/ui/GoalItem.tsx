import {
	Box,
	Checkbox,
	Collapsible,
	Flex,
	HStack,
	Loader,
	Text,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import { IconChevronRight } from "@tabler/icons-react";
import type { Goals } from "@/api/types/appwrite.d.ts";
import { useGoals } from "@/features/goals/api/goals.api.ts";

interface Props {
	goal: Goals;
}
export const GoalItem: React.FC<Props> = ({ goal }) => {
	const { open, setOpen } = useDisclosure();
	// const tx = useCreateTransaction({ tablesDB, name: "getAllSubGoals" });
	// const { data: subgoals, isLoading } = useGetChildrenRows<Goals>(
	// 	{
	// 		table_id: "goals",
	// 		parrent_id: goal.$id,
	// 	},
	// 	{ enabled: !goal.parent_id },
	// );
	const {
		goals: subgoals,
		isLoading,
		isFetched,
	} = useGoals(
		{
			parent_id: { equal: goal.$id },
		},
		// { enabled: !goal.parent_id },
	);

	const haveSubgoals = !!subgoals?.length;

	const percent =
		((subgoals?.filter((sg) => sg.completed)?.length || 0) / (subgoals?.length || 0)) *
		100;

	// if (!subgoals?.length) {
	// 	return (
	// 		<HStack
	// 			justifyContent={"space-between"}
	// 			alignItems={"center"}
	// 			bg={"surface-container"}
	// 			p={3}
	// 			borderRadius={"21px"}
	// 		>
	// 			<HStack>{goal.title}</HStack>
	// 			<HStack></HStack>
	// 		</HStack>
	// 	);
	// }

	if (!isFetched) return null;

	return (
		<VStack
			w={"100%"}
			bg={{ base: "surface-container" }}
			// p={3}
			borderRadius={"21px"}
			alignItems={"start"}
		>
			<Collapsible.Root w={"100%"} open={open} onOpenChange={(e) => setOpen(e.open)}>
				<Collapsible.Trigger asChild>
					<HStack
						justifyContent={"space-between"}
						px={3}
						py={3}
						bg={{ _hover: "surface-container-high" }}
						borderRadius={"21px"}
						position={"relative"}
					>
						<Flex
							w={"100%"}
							flexDirection={haveSubgoals ? "column" : "row"}
							justifyContent={haveSubgoals ? "start" : "start"}
							alignItems={haveSubgoals ? "start" : "center"}
							gap={"10px"}
						>
							{!haveSubgoals && (
								<Checkbox.Root>
									<Checkbox.HiddenInput />
									<Checkbox.Control />
								</Checkbox.Root>
							)}
							<Text>{goal.title}</Text>
							{haveSubgoals && (
								<HStack w={"100%"} justifyContent={"space-between"}>
									<Box
										w={0}
										h={"5px"}
										borderRadius={"21px"}
										bg={"primary"}
										bottom={"5px"}
										style={{ width: `${percent}%` }}
										transition={"width 200ms"}
									/>
									<Text color={"on-surface-darkest"}>{percent}%</Text>
								</HStack>
							)}
						</Flex>
						<HStack justifyContent={"end"} alignItems={"center"}>
							{haveSubgoals && (
								<IconChevronRight
									style={{
										rotate: open ? "90deg" : "0deg",
										transition: "rotate 200ms ease-in-out",
									}}
								/>
							)}
						</HStack>
					</HStack>
				</Collapsible.Trigger>

				<Collapsible.Content>
					<Loader visible={isLoading} />
					{isLoading && <Text>loading...</Text>}
					{subgoals?.map((subgoal) => {
						return <GoalItem key={subgoal.$id} goal={subgoal} />;
					})}
				</Collapsible.Content>
			</Collapsible.Root>
		</VStack>
	);
};
