import { Button, HStack, IconButton, Text } from "@chakra-ui/react";
import type { FC, ReactNode } from "react";
import { LuGithub, LuLogOut } from "react-icons/lu";
import { supabase } from "@/api/supabase";
import { useUser } from "@/api/queries/users.api.ts";

interface ISidebarFooterProps {
  children?: ReactNode;
}
export const SidebarFooter: FC<ISidebarFooterProps> = () => {
  console.log("Before sidebar user hook", useUser);

  const { data: user, refetch } = useUser();

  console.log("After sidebar user hook");

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
          <HStack
            borderWidth={"1px"}
            borderColor={"outline_variant"}
            borderRadius={"4px"}
            p="6px"
          >
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
