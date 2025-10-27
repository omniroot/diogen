import { HStack, IconButton, Separator } from "@chakra-ui/react";
import { IconArrowNarrowLeft, IconArrowNarrowRight, IconEdit, IconMenu, IconSearch, IconX } from "@tabler/icons-react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useCanGoForward } from "@/hooks/useCanGoForward.tsx";
import { useHeaderStore } from "@/stores/header.store.tsx";
import { useModals } from "@/stores/modals.store.tsx";

export const Header = () => {
	const { open: openIssue } = useModals("issue");
	const { open: openSearch } = useModals("search");
	const { isOpen, toggleOpen } = useHeaderStore();
	const isMobile = useMediaQuery("(max-width: 767px)");

	const canGoBack = useCanGoBack();
	const canGoForward = useCanGoForward();
	const { history } = useRouter();
	return (
		<HStack
			w="100%"
			h={"60px"}
			// display={{ base: "flex", md: "none" }}
			justifyContent={"space-between"}
			// p="12px 6px"
			// borderBottom={"2px solid"}
			// borderColor={"colors.outline"}
		>
			<HStack gap="8px" alignItems={"center"}>
				{isMobile && <IconButton onClick={() => toggleOpen()}>{isOpen ? <IconX /> : <IconMenu />}</IconButton>}
				<div
					style={{
						width: "32px",
						height: "32px",
						backgroundColor: "red",
						borderRadius: "50%",
					}}
				></div>
				<span>Diogen</span>
			</HStack>
			<HStack gap="4px" alignItems={"center"}>
				<IconButton size="sm" variant="ghost" onClick={() => history.back()} disabled={!canGoBack}>
					<IconArrowNarrowLeft />
				</IconButton>
				<IconButton size="sm" variant="ghost" onClick={() => history.forward()} disabled={!canGoForward}>
					<IconArrowNarrowRight />
				</IconButton>
				<Separator orientation="vertical" w={"2px"} h={"20px"} />
				<IconButton variant="ghost" color={"subtext"} onClick={() => openSearch("create")}>
					<IconSearch />
				</IconButton>
				<IconButton onClick={() => openIssue("create")}>
					<IconEdit />
				</IconButton>
			</HStack>
		</HStack>
	);
};
