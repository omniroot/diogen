import { Checkbox, chakra, HStack, type HTMLChakraProps, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { type FC, forwardRef, useEffect, useState } from "react";
import { useSelectionStore } from "@/stores/selection.store.tsx";
import type { IIssue } from "@/api/supabase.ts";
import { LabelMenu } from "@/components/business/LabelMenu.tsx";
import { StatusMenu } from "@/components/business/StatusMenu.tsx";
import { IssueContextMenu } from "@/components/business/IssueContextMenu.tsx";

interface IIssueItem extends HTMLChakraProps<"div"> {
	issue?: IIssue;
}

export const IssueItem: FC<IIssueItem> = forwardRef<HTMLDivElement, IIssueItem>(({ issue, ...props }, ref) => {
	const [pos, setPos] = useState({ x: 0, y: 0 });
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const { issues, toggleIssue, getIsSelected } = useSelectionStore();
	const [isSelected, setIsSelected] = useState(getIsSelected(issue));

	useEffect(() => {
		setIsSelected(getIsSelected(issue));
	}, [getIsSelected, setIsSelected, issues, issue]);

	console.log({ issues, issue, isSelected });

	const onContextMenuClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		setPos({ x: e.clientX, y: e.clientY });
		console.log(e.clientX, e.clientY);

		setIsMenuOpen((prev) => !prev);
	};

	return (
		<chakra.div
			w={"100%"}
			display={"flex"}
			justifyContent={"space-between"}
			alignItems={"center"}
			px={2}
			py={2}
			bg={isMenuOpen ? "surface_container_high" : "transparent"}
			border={isSelected ? "1px solid {colors.primary}" : "1px solid transparent"}
			_hover={!isMenuOpen ? { bg: "hover" } : {}}
			borderRadius={"sm"}
			ref={ref}
			onContextMenu={onContextMenuClick}
			{...props}
			asChild
		>
			<Link
				to="/issues/$issue_id"
				params={{
					issue_id: String(issue?.id),
				}}
				preload={false}
			>
				<HStack w={"100%"} justifyContent={"start"} alignItems={"center"}>
					<Checkbox.Root defaultChecked={isSelected} onCheckedChange={() => toggleIssue(issue)}>
						<Checkbox.HiddenInput />
						<Checkbox.Control borderColor={"outline_variant"} onClick={(e) => e.stopPropagation()}>
							<Checkbox.Indicator />
						</Checkbox.Control>
					</Checkbox.Root>
					{issue?.custom_id && (
						<Text minW={"60px"} color={"subtext2"}>
							{issue?.custom_id}
						</Text>
					)}
					<StatusMenu issue={issue} />
					<Text color={"text"}>{issue?.title}</Text>
				</HStack>
				<HStack justifyContent={"end"} alignItems={"center"}>
					<LabelMenu issue={issue} isShow={!!issue?.label} />
				</HStack>

				{/* <Presence
					present={isMenuOpen}
					animationName={{ _open: "fade-in", _closed: "fade-out" }}
					animationDuration="moderate"
				> */}
				<IssueContextMenu issue={issue} pos={pos} open={isMenuOpen} onChange={setIsMenuOpen} />
				{/* </Presence> */}
				{/* <Menu.Item value="new-txt">New Text File</Menu.Item>
											<Menu.Item value="new-file">New File...</Menu.Item>
											<Menu.Item value="new-win">New Window</Menu.Item>
											<Menu.Item value="open-file">Open File...</Menu.Item>
											<Menu.Item value="export">Export</Menu.Item> */}
			</Link>
		</chakra.div>
	);
});
