import type { IIssue } from "@/api/supabase.interface.ts";
import { IssueItem } from "@/components/business/IssueItem/IssueItem.tsx";
import { PriorityBadge } from "@/components/ui/Badge.tsx";
import { Box, Button, HStack, IconButton, Text, VStack } from "@chakra-ui/react";
import { IconEdit, type ReactNode } from "@tabler/icons-react";
import { createLazyRoute } from "@tanstack/react-router";

const VList = ({ title, children }: { title?: string; children?: ReactNode }) => {
	return (
		<VStack w="100%" alignItems={"start"} gap="4px" p={"8px"}>
			<Text fontSize={"large"} fontWeight={"bold"} m={"4px"}>
				{title}
			</Text>
			{children}
		</VStack>
	);
};

const HList = ({ title, children }: { title?: string; children?: ReactNode }) => {
	return (
		<HStack w="100%" gap="8px" alignItems={"center"}>
			<Text minW={"50px"} fontSize={"small"} fontWeight={"medium"} m={"4px"}>
				{title}
			</Text>
			<Box w="2px" h={"40%"} bg={"colors.outline"} borderRadius={"12px"}></Box>
			{children}
		</HStack>
	);
};

export const TestPage = () => {
	const issue: IIssue = {
		id: 1,
		title: "Issue",
		description: "Issue description",
		priority: "normal",
		created_at: "2025-09-19T02:09:10.000Z",
		updated_at: "2025-09-19T02:09:10.000Z",
		completed: false,
		custom_id: "DIO-12",
		end_date: "2025-09-19T02:09:10.000Z",
		label: "Issue label",
		module_id: 1,
		start_date: "2025-09-19T02:09:10.000Z",
		user_id: "1",
		project_id: null,
		task_number: null,
	};

	return (
		<>
			<Text fontSize={"2xl"} fontWeight={"bold"} m={"8px"}>
				All ui components
			</Text>
			<VList title="Issue">
				<IssueItem issue={issue} />
				{/* <HList title="Primary"></HList> */}
			</VList>
			<VList title="Button">
				<HList title="Primary">
					<Button variant={"primary"} size="sm">
						Primary
					</Button>
					<Button variant={"primary"} size="md">
						Primary
					</Button>
					<Button variant={"primary"} size="lg">
						Primary
					</Button>
					<Button variant={"primary"} size="lg">
						<IconEdit />
						Primary with icon
					</Button>
				</HList>
				<HList title="Surface">
					<Button variant={"surface"} size="sm">
						Surface
					</Button>
					<Button variant={"surface"} size="md">
						Surface
					</Button>
					<Button variant={"surface"} size="lg">
						Surface
					</Button>
					<Button variant={"surface"} size="lg">
						<IconEdit />
						Surface with icon
					</Button>
				</HList>
				<HList title="Outline">
					<Button variant={"outline"} size="sm">
						Outline
					</Button>
					<Button variant={"outline"} size="md">
						Outline
					</Button>
					<Button variant={"outline"} size="lg">
						Outline
					</Button>
					<Button variant={"outline"} size="lg">
						<IconEdit />
						Outline with icon
					</Button>
				</HList>
				<HList title="Ghost">
					<Button variant={"ghost"} size="sm">
						Ghost
					</Button>
					<Button variant={"ghost"} size="md">
						Ghost
					</Button>
					<Button variant={"ghost"} size="lg">
						Ghost
					</Button>
					<Button variant={"ghost"} size="lg">
						<IconEdit />
						Ghost with icon
					</Button>
				</HList>
			</VList>

			<VList title="Icon Button">
				<HList title="Primary">
					<IconButton size="sm" variant={"primary"}>
						<IconEdit />
					</IconButton>
					<IconButton size="md" variant={"primary"}>
						<IconEdit />
					</IconButton>
					<IconButton size="lg" variant={"primary"}>
						<IconEdit />
					</IconButton>
				</HList>
				<HList title="Surface">
					<IconButton size="sm" variant={"surface"}>
						<IconEdit />
					</IconButton>
					<IconButton size="md" variant={"surface"}>
						<IconEdit />
					</IconButton>
					<IconButton size="lg" variant={"surface"}>
						<IconEdit />
					</IconButton>
				</HList>
				<HList title="Outline">
					<IconButton size="sm" variant={"outline"}>
						<IconEdit />
					</IconButton>

					<IconButton size="md" variant={"outline"}>
						<IconEdit />
					</IconButton>
					<IconButton size="lg" variant={"outline"}>
						<IconEdit />
					</IconButton>
				</HList>
				<HList title="Ghost">
					<IconButton size="sm" variant={"ghost"}>
						<IconEdit />
					</IconButton>

					<IconButton size="md" variant={"ghost"}>
						<IconEdit />
					</IconButton>
					<IconButton size="lg" variant={"ghost"}>
						<IconEdit />
					</IconButton>
				</HList>
			</VList>
			<VList title="Badge">
				<HList title="Priority">
					<PriorityBadge variant="normal" />
					<PriorityBadge variant="medium" />
					<PriorityBadge variant="critical" />
				</HList>
			</VList>
		</>
	);
};

export const Route = createLazyRoute("/test")({
	component: TestPage,
});
