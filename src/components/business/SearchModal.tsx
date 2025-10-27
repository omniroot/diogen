import { Dialog, Input, InputGroup, Portal, VStack } from "@chakra-ui/react";
import { useDebounceValue, useKeyPress } from "@siberiacancode/reactuse";
import { IconLoader2, IconSearch } from "@tabler/icons-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { useGetIssues } from "@/api/queries/issues.api.ts";
import { IssueItem } from "@/features/issues/components/IssueItem.tsx";
import { useModals } from "@/stores/modals.store.tsx";

export const SearchModal = () => {
	const isDesktop = useMediaQuery("(min-width: 1280px)");
	const { isOpen, open, close } = useModals("search");
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounceValue(search, 400);

	const { data: results, refetch, isFetching } = useGetIssues({ title: debouncedSearch }, { enabled: false });

	useEffect(() => {
		console.log("search", debouncedSearch);
		refetch();
	}, [debouncedSearch, refetch]);

	useKeyPress("p", (_, event) => {
		// setCreateModuleModal(true);
		if (!isOpen) {
			console.log("P pressed");
			open();
			event.preventDefault();
			return;
		}
	});

	return (
		<Dialog.Root
			open={isOpen}
			onOpenChange={(e) => {
				if (e.open) {
					open();
				} else close();
			}}
			placement={"center"}
		>
			<Portal>
				<Dialog.Backdrop backdropFilter={"blur({blurs.sm})"} />
				<Dialog.Positioner>
					<Dialog.Content minW={isDesktop ? "1000px" : "90dvw"}>
						{/* <form onSubmit={handleSubmit(onSubmit)}> */}
						{/* <Dialog.Header>
							<Dialog.Title>Create Issue</Dialog.Title>
						</Dialog.Header> */}
						<Dialog.Body display={"flex"} flexDirection={"column"} gap={4} p={2} maxH={"70dvh"}>
							{/* {custom_id} {">"} {"modules > "} {module?.title} */}
							{/* <HStack gap={0} position={"relative"} > */}
							{/* <EmojiPicker onChange={setEmoji} /> */}

							<InputGroup
								startElement={<IconSearch />}
								endElement={
									<IconLoader2 style={{ animation: "var(--chakra-animations-spin)", opacity: isFetching ? 1 : 0 }} />
								}
								gap={2}
								// border={"1px solid {colors.outline}"}
								_icon={{ color: "subtext2" }}
								// borderRadius={"md"}
								// borderBottom={"2px solid {colors.outline}"}
							>
								<Input
									p={6}
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Search issues, modules and etc..."
									border={"none"}
									outline={"none"}
									fontSize={"lg"}
									_placeholder={{ color: "subtext2" }}
									autoFocus
									marginLeft={1}
									// {...register("title")}
								/>
							</InputGroup>
							<VStack overflowY={"scroll"}>
								{results?.map((result) => {
									return (
										<IssueItem key={result.id} issue={result} onClick={() => close()} />
										// <HStack  w={"100%"} p={2} border={"2px solid {colors.outline}"}>
										// 	{result.title}
										// </HStack>
									);
								})}
							</VStack>
							{/* </HStack> */}
							{/* <Separator borderWidth={"1.5px"} /> */}
							{/* <StatusSelect value={statusValue} onChange={setStatusValue} showTitle={true} /> */}
							{/* <LabelSelect value={labelValue} onChange={setLabelValue} showTitle={true} /> */}
						</Dialog.Body>
						{/* <Dialog.Footer> */}
						{/* <Dialog.ActionTrigger asChild>
								<Button variant="outline">Cancel</Button>
							</Dialog.ActionTrigger>
							<Button variant={"primary"} type="submit">
								Create
							</Button> */}
						{/* </Dialog.Footer> */}

						{/* </form> */}
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
