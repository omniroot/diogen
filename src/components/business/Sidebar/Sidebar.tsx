import { VStack } from "@chakra-ui/react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useState } from "react";
import { Header } from "@/components/Header";

export const Sidebar = () => {
	// const { isOpen } = useHeaderStore();
	// const locations = useLocationStore();
	const isMobile = useMediaQuery("(max-width: 767px)");
	// const isTablet = useMediaQuery("(min-width: 768px)");
	// const isDesktop = useMediaQuery("(min-width: 1280px)");

	const [size] = useState("330px");
	// const resizeRef = useResizable() as React.RefObject<HTMLDivElement | null>;
	// const sidebarRef = useRef<HTMLDivElement>(null);
	// const resizerRef = useRef<HTMLDivElement>(null);
	// const isResizing = useRef(false);
	// console.log({ isMobile, isTablet, isDesktop });

	// const onMouseMove = (event: React.DragEvent<HTMLDivElement>) => {
	//   if (isResizing) {
	//     console.log(event);
	//   }
	// };
	// const isOpen2 = isOpen ? true : isTablet || isDesktop ? true : false;

	return (
		<VStack
			w={isMobile ? "100dvw" : size}
			display={"none"}
			// display={isOpen2 ? "flex" : "none"}
			style={isMobile ? { position: "fixed", marginTop: "60px" } : { marginTop: -17 }}
			h={isMobile ? "90dvh" : "99dvh"}
			justify="flex-start"
			p={"2"}
			bg={"surface"}
			// ref={resizeRef}
			zIndex={10}
		>
			{!isMobile && <Header />}
			{/* <SidebarMenus /> */}
			{/* <SidebarProjects /> */}
			{/* <VStack w={"100%"} h="auto" mt={"auto"}>
				<VStack
					w={"100%"}
					bg={"surface_container"}
					border={"2px solid {colors.outline}"}
					borderRadius={"md"}
				>
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
				<Button w="100%" asChild>
					<Link to="/login">Login with Github</Link>
				</Button>
			</VStack> */}
			{/* <SidebarActions /> */}

			{/* <Button
        onClick={() => supabase.auth.signInWithOAuth({ provider: "github" })}
      >
        Auth
      </Button> */}
		</VStack>
	);
};
