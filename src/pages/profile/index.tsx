import { Button, Image, Text, VStack } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/auth.hook.ts";

export const Route = createFileRoute("/profile/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user } = useAuth();
	return (
		<>
			<VStack w={"100%"} gap={"5px"} alignItems={"start"}>
				<Image
					src={user?.avatar || "logo.webp"}
					w={"84px"}
					h={"84px"}
					borderRadius={"50%"}
				/>
				<Text fontWeight={"bold"} fontSize={"21px"}>
					{user?.nickname}
				</Text>
				<Text fontSize={"16px"}>{user?.description}</Text>
			</VStack>
			<Button>Primary</Button>
			<Button variant={"secondary"}>Secondary</Button>
			<Button variant={"tertiary"}>Tertiary</Button>
			<Button variant={"surface"}>Surface</Button>
			<Button variant={"plain"}>Plain</Button>
			<Button variant={"outline"}>Outline</Button>
			<Button variant={"ghost"}>Ghost</Button>
		</>
	);
}
