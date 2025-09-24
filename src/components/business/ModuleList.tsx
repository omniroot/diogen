import { Badge } from "@chakra-ui/react";
import { IconBlocks } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { getModulesOptions } from "@/api/queries/modules.api.ts";
import type { IProject } from "@/api/supabase.interface.ts";
import { ModuleItem } from "@/components/business/ModuleItem.tsx";
import { Section } from "@/components/business/Section/Section.tsx";

interface IModuleListProps {
	project_id?: IProject["id"];
}
export const ModuleList: FC<IModuleListProps> = ({ project_id }) => {
	const { data: modules, isFetching } = useQuery(getModulesOptions({ project_id }));

	return (
		<Section
			icon={<IconBlocks />}
			title="Modules"
			orientation="horizontal"
			infoSlot={
				<Badge size={"lg"} variant={"solid"} transition={"opacity 200ms"} opacity={isFetching ? 1 : 0}>
					Sync
				</Badge>
			}
		>
			{modules?.map((module) => {
				return <ModuleItem key={module.id} module={module} />;
			})}
		</Section>
	);
};
