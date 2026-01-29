import { Heading, IconButton, Image, Text } from "@chakra-ui/react";
import { IconEdit, IconShare2 } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/auth.hook.ts";
import { KaizenCard } from "@/theme/ui/KaizenCard.tsx";

export const Route = createFileRoute("/profile/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = useAuth();
	return (
		<>
			<KaizenCard.Root>
				{/* <KaizenCard.Header>
					<VStack gap={"0"}>
						<KaizenCard.Title>Habits plan</KaizenCard.Title>
						<KaizenCard.Description>Description</KaizenCard.Description>
					</VStack>
				</KaizenCard.Header> */}
				<KaizenCard.Body>
					<Image
						src={user?.avatar || "logo.webp"}
						w={"84px"}
						h={"84px"}
						borderRadius={"50%"}
					/>
					<Heading fontSize={"21px"}>{user?.nickname}</Heading>
					<Text fontSize={"16px"}>{user?.description}</Text>
				</KaizenCard.Body>
				<KaizenCard.Footer justifyContent={"end"}>
					<IconButton
						color={"on-surface"}
						bg={"surface-container-high"}
						borderRadius={"full"}
					>
						<IconShare2 />
					</IconButton>
					<IconButton
						color={"on-surface"}
						bg={"surface-container-high"}
						borderRadius={"full"}
					>
						<IconEdit />
					</IconButton>
				</KaizenCard.Footer>
			</KaizenCard.Root>
			{/* <VStack w={"100%"} gap={"5px"} alignItems={"start"}></VStack>
			<Button>Primary</Button>
			<Button variant={"secondary"}>Secondary</Button>
			<Button variant={"tertiary"}>Tertiary</Button>
			<Button variant={"surface"}>Surface</Button>
			<Button variant={"plain"}>Plain</Button>
			<Button variant={"outline"}>Outline</Button>
			<Button variant={"ghost"}>Ghost</Button> */}
		</>
	);
}
