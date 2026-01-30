import {
	Button,
	Link as ChakraLink,
	HStack,
	IconButton,
	Image,
	Loader,
	Text,
} from "@chakra-ui/react";
import { IconFlare, IconMenu2 } from "@tabler/icons-react";
import { ClientOnly, Link } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/auth.hook.ts";
import { KaizenLoader } from "@/theme/ui/KaizenLoader.tsx";

// import { useCanGoForward } from "@/hooks/useCanGoForward.tsx";
// import { useHeaderStore } from "@/stores/header.store.tsx";
// import { useModals } from "@/stores/modals.store.tsx";

export const Header = () => {
	const { user, isLoading } = useAuth();
	// const pathname = useLocation().pathname;
	// const isShowAvatar = !(pathname === "/profile" || pathname === "/login");

	// const { open: openIssue } = useModals("issue");
	// const { open: openSearch } = useModals("search");
	// const { isOpen, toggleOpen } = useHeaderStore();
	// const isMobile = useMediaQuery("(max-width: 767px)");

	// const canGoBack = useCanGoBack();
	// const canGoForward = useCanGoForward();
	// const { history } = useRouter();

	// const openSearch = (_a: string) => {};
	// const openIssue = (_a: string) => {};

	return (
		<HStack
			w="100%"
			h={"60px"}
			// display={{ base: "flex", md: "none" }}
			justifyContent={"space-between"}
			p="15px 15px"
			// borderBottom={"2px solid"}
			// borderColor={"colors.outline"}
		>
			<HStack gap="10px" alignItems={"center"}>
				{/* {isMobile && (
					<IconButton onClick={() => toggleOpen()}>
						{isOpen ? <IconX /> : <IconMenu2 />}
					</IconButton>
				)} */}
				{/* <div
					style={{
						width: "32px",
						height: "32px",
						backgroundColor: "red",
						borderRadius: "50%",
					}}
				></div> */}
				{/* <Image
					w={"32px"}
					h={"32px"}
					borderRadius={"md"}
					src="/logo.webp"
					alt="App Logo"
					loading="eager"
					decoding="async"
					fetchPriority="high"
				/> */}
				<IconButton
					bg={"transparent"}
					color={"on-surface"}
					w={"24px"}
					minW={"24px"}
					h={"24px"}
					p={"0"}
				>
					<IconMenu2 style={{ width: "24px", height: "24px" }} />
				</IconButton>

				<Text fontSize={"21px"} fontWeight={"bold"} asChild>
					<Link to="/">Diogen</Link>
				</Text>
			</HStack>
			<HStack gap="8px" alignItems={"center"}>
				{/* {isShowAvatar && ( */}
				<ChakraLink asChild>
					<Link to={"/profile"}>
						<Button
							borderRadius={"full"}
							gap={"4px"}
							_icon={{ w: "16px", h: "16px" }}
							// h={"35px"}
							size={"sm"}
						>
							<IconFlare />
							<Text>100</Text>
						</Button>
					</Link>
				</ChakraLink>
				<ChakraLink asChild>
					<Link to={user?.$id ? "/profile" : "/login"}>
						{isLoading ? (
							<ClientOnly fallback={<Loader visible={isLoading} />}>
								<KaizenLoader />
							</ClientOnly>
						) : (
							<Image
								src={user?.avatar || "logo.webp"}
								w={"42px"}
								h={"42px"}
								borderRadius={"50%"}
							/>
						)}
					</Link>
				</ChakraLink>
				{/* )} */}
				{/* <IconButton
					size="sm"
					variant="ghost"
					onClick={() => history.back()}
					disabled={!canGoBack}
				>
					<IconArrowNarrowLeft />
				</IconButton>
				<IconButton
					size="sm"
					variant="ghost"
					onClick={() => history.forward()}
					// disabled={!canGoForward}
				>
					<IconArrowNarrowRight />
				</IconButton>
				<Separator orientation="vertical" w={"2px"} h={"20px"} />
				<IconButton
					variant="ghost"
					color={"subtext"}
					onClick={() => openSearch("create")}
				>
					<IconSearch />
				</IconButton>
				<IconButton onClick={() => openIssue("create")}>
					<IconEdit />
				</IconButton> */}
			</HStack>
		</HStack>
	);
};
