import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/api/supabase.ts";
import { SidebarHeader } from "@/components/business/Sidebar/SidebarHeader/SidebarHeader";
import { SidebarProjects } from "@/components/business/Sidebar/SidebarProjects/SidebarProjects";
import { useResizable } from "@/hooks/useResizable.tsx";
import { useLocationStore } from "@/stores/location.store.tsx";
export const Sidebar = () => {
	const locations = useLocationStore();
	const [size, setSize] = useState("290px");
	const resizeRef = useResizable();
	// const sidebarRef = useRef<HTMLDivElement>(null);
	// const resizerRef = useRef<HTMLDivElement>(null);
	// const isResizing = useRef(false);

	// const onMouseMove = (event: React.DragEvent<HTMLDivElement>) => {
	//   if (isResizing) {
	//     console.log(event);
	//   }
	// };

	const onLoginWithGithubClick = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "github",
		});
		console.log("Authorized: ", data, error);
	};

	return (
		<>
			<VStack w={size} h={"99.9dvh"} justify="flex-start" p={"2"} ref={resizeRef}>
				<SidebarHeader />
				<SidebarProjects />
				<VStack w={"100%"} mt={"auto"}>
					<VStack w={"100%"} bg={"surface_container"} border={"2px solid {colors.outline}"} borderRadius={"md"}>
						{Object.entries(locations).map(([name, value]) => {
							return (
								<HStack w="100%" justifyContent={"space-between"} px={2} py={1} key={name}>
									<Text fontWeight={"bold"}>{name}:</Text>
									<Text>{value}</Text>
								</HStack>
							);
						})}
					</VStack>
					<Button w="100%" asChild>
						<Link to="/test">Test page</Link>
					</Button>
					<Button w="100%" onClick={onLoginWithGithubClick}>
						Login with Github
					</Button>
				</VStack>
				{/* <SidebarActions /> */}

				{/* <Button
        onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}
      >
        Auth
      </Button> */}
			</VStack>
			{/* <VStack
        ref={resizerRef}
        w={"10px"}
        h={"99.9dvh"}
        justifyContent={"center"}
        opacity={"0"}
        _hover={{ opacity: 1 }}
        transition={"opacity 200ms"}
        color={"subtext"}
        userSelect={"none"}
        cursor={"e-resize"}
        onMouseDown={() => (isResizing.current = true)}
        onMouseUp={() => (isResizing.current = false)}
        // onMouseMove={onMouseMove}
        draggable
        onDragStart={() => (isResizing.current = true)}
        onDragEnd={() => (isResizing.current = false)}
        onDrag={onMouseMove}
      >
        <HStack
          w={"5px"}
          h={"35px"}
          bg={"subtext"}
          borderRadius={"12px"}
        ></HStack>
      </VStack> */}
		</>
	);
};
