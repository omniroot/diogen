import { IconButton } from "@chakra-ui/react";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { IconPlus } from "@tabler/icons-react";
import { useGetProjects } from "@/api/queries/projects.api.ts";
import { supabase } from "@/api/supabase.ts";
import { SidebarProjectItem } from "@/components/business/Sidebar/SidebarProjectItem.tsx";
import { SidebarSection } from "@/components/business/Sidebar/SidebarSection.tsx";

export const SidebarProjects = () => {
	const { data: projects } = useGetProjects();

	if (!projects) return null;

	return (
		<SidebarSection
			title="Projects"
			defaultOpen
			action={
				<IconButton size="sm" variant="ghost" color={"subtext"}>
					<IconPlus />
				</IconButton>
			}
		>
			<DragDropProvider
				onDragEnd={async (event) => {
					const newProjects = move(projects, event);
					const newData = newProjects.map((p, index) => ({ id: p.id, position: index }));
					await supabase.rpc("update_positions", {
						table_name: "projects",
						updates: newData,
					});
				}}
			>
				{projects?.map((project, index) => {
					return <SidebarProjectItem key={project.id} project={project} index={index} />;
				})}
			</DragDropProvider>
		</SidebarSection>
	);
};

// type ITypes = "overview" | "issues" | "modules";

// interface ISidebarProjectSubItem {
//   project: IProject;
//   type: ITypes;
// }

// type ITypesList = Record<
//   ITypes,
//   {
//     icon: ReactNode;
//     title: string;
//     to: keyof typeof routeTypes;
//   }
// >;

// const typesList: ITypesList = {
//
// };

// const SidebarProjectSubItem: FC<ISidebarProjectSubItem> = ({
//   project,
//   type,
// }) => {
//   const { icon, title, to } = typesList[type];
//   return (
//     <HStack
//       w={"100%"}
//       bg={{ _hover: "hover" }}
//       p={2}
//       borderRadius={"md"}
//       asChild
//     >
//       <Link to={to} params={{ custom_id: project.custom_id }}>
//         <Icon color={"subtext"} size={"sm"} transition={"rotate 200ms"}>
//           {icon}
//         </Icon>
//         <Text color={"text"}>{title}</Text>
//       </Link>
//     </HStack>
//   );
// };
