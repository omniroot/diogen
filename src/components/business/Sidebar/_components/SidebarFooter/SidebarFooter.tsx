import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import { LuGithub, LuLogOut } from "react-icons/lu";
import { useGetUser } from "@/api/queries/users.api";
import { supabase } from "@/api/supabase";

interface ISidebarFooterProps {
	children?: ReactNode;
}
export const SidebarFooter: FC<ISidebarFooterProps> = () => {
	const { data: user, refetch } = useGetUser();

	const onGithubLoginClick = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "github",
		});

		console.log("Authorized: ", data, error);
	};

	const onLogoutClick = async () => {
		const { error } = await supabase.auth.signOut();
		refetch();
		console.log("Logout: ", error);
	};

	return (
		<HStack w={"100%"} p="4px" justifyContent={"space-between"}>
			{user ? (
				<>
					<HStack borderWidth={"1px"} p="6px">
						<Text>{user && user.email}</Text>
					</HStack>
					<HStack>
						<IconButton variant={"outline"} onClick={onLogoutClick}>
							<LuLogOut />
						</IconButton>
					</HStack>
				</>
			) : (
				<Button onClick={onGithubLoginClick} w="100%" variant={"outline"}>
					<LuGithub /> Authotization with Github
				</Button>
			)}
		</HStack>
	);
};
