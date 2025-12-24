import { Checkbox, chakra, HStack, type HTMLChakraProps, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { type FC, forwardRef, useEffect, useState } from "react";
import { useGetProjects } from "@/api/queries/projects.api.ts";
import type { IIssue } from "@/api/supabase.ts";
import { IssueContextMenu } from "@/components/business/IssueContextMenu.tsx";
import { LabelSelect } from "@/components/business/LabelSelect";
import { StatusSelect } from "@/components/business/StatusSelect";
import { useSelectionStore } from "@/stores/selection.store.tsx";

interface IIssueItem extends HTMLChakraProps<"div"> {
	issue?: IIssue;
}

export const IssueItem: FC<IIssueItem> = forwardRef<HTMLDivElement, IIssueItem>(
	({ issue, ...props }, ref) => {
		const [pos, setPos] = useState({ x: 0, y: 0 });
		const [isMenuOpen, setIsMenuOpen] = useState(false);
		const { issues, toggleIssue, getIsSelected } = useSelectionStore();
		const [isSelected, setIsSelected] = useState(getIsSelected(issue));
		const { data: projects } = useGetProjects();

		console.log({ projects });

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

		const project_custom_id = projects?.filter((i) => i.id === issue?.project_id)[0]
			.custom_id;

		const link = issue?.module_id
			? `/projects/${project_custom_id}/modules/${issue.module_id}`
			: `/projects/${project_custom_id}`;

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
					to={link}
					params={{
						issue_id: String(issue?.id),
					}}
					preload={false}
				>
					<HStack w={"100%"} justifyContent={"start"} alignItems={"center"}>
						<Checkbox.Root
							defaultChecked={isSelected}
							onCheckedChange={() => toggleIssue(issue)}
						>
							<Checkbox.HiddenInput />
							<Checkbox.Control
								borderColor={"outline_variant"}
								onClick={(e) => e.stopPropagation()}
							>
								<Checkbox.Indicator />
							</Checkbox.Control>
						</Checkbox.Root>
						{issue?.custom_id && (
							<Text minW={"60px"} color={"subtext2"}>
								{issue?.custom_id}
							</Text>
						)}
						<StatusSelect value={issue?.status} />
						<Text color={"text"}>{issue?.title}</Text>
					</HStack>
					<HStack justifyContent={"end"} alignItems={"center"}>
						<LabelSelect value={issue?.label} showTitle={true} />
						{project_custom_id && (
							<HStack
								border={"2px solid {colors.outline}"}
								py={1}
								px={2}
								borderRadius={"full"}
							>
								{project_custom_id}
							</HStack>
						)}

						{issue?.module_id && (
							<HStack
								border={"2px solid {colors.outline}"}
								py={1}
								px={2}
								borderRadius={"full"}
							>
								{issue?.module_id}
							</HStack>
						)}
					</HStack>

					{/* <Presence
					present={isMenuOpen}
					animationName={{ _open: "fade-in", _closed: "fade-out" }}
					animationDuration="moderate"
				> */}
					<IssueContextMenu
						issue={issue}
						pos={pos}
						open={isMenuOpen}
						onChange={setIsMenuOpen}
					/>
					{/* </Presence> */}
					{/* <Menu.Item value="new-txt">New Text File</Menu.Item>
											<Menu.Item value="new-file">New File...</Menu.Item>
											<Menu.Item value="new-win">New Window</Menu.Item>
											<Menu.Item value="open-file">Open File...</Menu.Item>
											<Menu.Item value="export">Export</Menu.Item> */}
				</Link>
			</chakra.div>
		);
	},
);
