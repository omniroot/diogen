import {
	Button,
	CloseButton,
	Collapsible,
	Dialog,
	HStack,
	Icon,
	IconButton,
	Portal,
	Text,
	useDisclosure,
	VStack,
} from "@chakra-ui/react";
import { RestrictToVerticalAxis } from "@dnd-kit/abstract/modifiers";
import { useSortable } from "@dnd-kit/react/sortable";
// import {  } from "@dnd-kit/sortable";
import {
	IconAssembly,
	IconBlocks,
	IconChevronRight,
	IconCopyCheck,
	IconGripVertical,
	IconTrash,
} from "@tabler/icons-react";
import { useHover } from "@uidotdev/usehooks";
import type { FC } from "react";
import { keyFactory, refetchQuery } from "@/api/api.ts";
import { useDeleteProjects } from "@/api/queries/projects.api.ts";
import type { IProject } from "@/api/supabase.ts";
import { ProjectCircle } from "@/components/business/ProjectCircle/ProjectCircle.tsx";
import { SidebarItem } from "@/components/business/Sidebar/SidebarItem.tsx";
import { useLocationStore } from "@/stores/location.store.tsx";
import { toaster } from "@/theme/components/toaster.tsx";

interface ISidebarProjectItem {
	project: IProject;
	index: number;
}

export const SidebarProjectItem: FC<ISidebarProjectItem> = ({ project, index }) => {
	const [hoverRef, isHovered] = useHover();
	const { custom_id } = useLocationStore();
	const { mutate: deleteProject } = useDeleteProjects();
	const { ref } = useSortable({
		id: project.id,
		index: index,
		modifiers: [RestrictToVerticalAxis],
		data: () => {
			return {
				type: "project",
				project: project,
			};
		},
	});

	// const style = {
	//   transform: CSS.Transform.toString(transform),
	//   transition,
	// };

	const { open, onToggle } = useDisclosure({
		defaultOpen: custom_id !== null && custom_id === project.custom_id,
	});

	const setRefs = (node: HTMLDivElement) => {
		if (node) {
			ref(node);
			hoverRef(node);
		}
	};

	const onDeleteClick = () => {
		deleteProject(project.id, {
			onSuccess: () => {
				toaster.create({
					title: `Project ${project.title} deleted!`,
				});
				refetchQuery(keyFactory.projects.all);
			},
		});
	};

	return (
		<Collapsible.Root open={open} onOpenChange={onToggle} w={"100%"} ref={setRefs}>
			<Collapsible.Trigger asChild>
				<HStack
					pos="relative"
					w={"100%"}
					justifyContent={"space-between"}
					bg={{ _default: "transparent", _hover: "hover" }}
					ref={setRefs}
					p={1}
					borderRadius={"md"}
					cursor={"pointer"}
					userSelect={"none"}
				>
					<HStack>
						<Icon
							pos={"fixed"}
							left={"0"}
							color={"subtext2"}
							size={"sm"}
							_hover={{
								bg: "transparent",
							}}
							opacity={isHovered ? 1 : 0}
							transition={"opacity 200ms"}
							onClick={(e) => e.stopPropagation()}
						>
							<IconGripVertical />
						</Icon>

						<ProjectCircle color={project.color} variant={open ? "filled" : "outline"} />
						{project.title}
						<Icon
							color={"subtext"}
							size={"md"}
							rotate={open ? "90deg" : "0deg"}
							transition={"rotate 200ms"}
						>
							<IconChevronRight />
						</Icon>
					</HStack>
					<HStack onClick={(e) => e.stopPropagation()}>
						<Dialog.Root>
							<Dialog.Trigger asChild>
								<IconButton
									color={"subtext"}
									opacity={isHovered ? 1 : 0}
									transition={"opacity 200ms"}
									variant={"ghost"}
									size={"sm"}
								>
									<IconTrash />
								</IconButton>
							</Dialog.Trigger>
							<Portal>
								<Dialog.Backdrop />
								<Dialog.Positioner>
									<Dialog.Content>
										<Dialog.Header>
											<Dialog.Title>Delete {project.title}?</Dialog.Title>
										</Dialog.Header>
										<Dialog.Body>
											<Text>You are sure sure you want to remove this project?</Text>
										</Dialog.Body>
										<Dialog.Footer>
											<Dialog.ActionTrigger asChild>
												<Button variant="outline">Cancel</Button>
											</Dialog.ActionTrigger>
											<Button bg={"red.500"} onClick={onDeleteClick}>
												Delete
											</Button>
										</Dialog.Footer>
										<Dialog.CloseTrigger asChild>
											<CloseButton size="sm" />
										</Dialog.CloseTrigger>
									</Dialog.Content>
								</Dialog.Positioner>
							</Portal>
						</Dialog.Root>
					</HStack>
				</HStack>
			</Collapsible.Trigger>
			<Collapsible.Content>
				<VStack pl={4} gap={"0"}>
					<SidebarItem
						icon={<IconAssembly />}
						title="Overview"
						to={"/projects/$custom_id"}
						custom_id={project.custom_id}
					/>
					<SidebarItem
						icon={<IconCopyCheck />}
						title="Issues"
						to={"/projects/$custom_id/kanban"}
						custom_id={project.custom_id}
					/>
					<SidebarItem
						icon={<IconBlocks />}
						title="Modules"
						to={"/projects/$custom_id/modules"}
						custom_id={project.custom_id}
					/>
				</VStack>
			</Collapsible.Content>
		</Collapsible.Root>
	);
};
