import { Badge, IconButton } from "@chakra-ui/react";
import { IconBlocks, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { getModulesOptions } from "@/api/queries/modules.api.ts";
import type { IProject } from "@/api/supabase.ts";
import { Section } from "@/components/business/Section.tsx";
import { ModuleItem } from "@/features/modules/_components/ModuleItem";
import { useModalsStore } from "@/stores/modals.store.tsx";

interface IModuleListProps {
	project_id?: IProject["id"];
}
export const ModuleList: FC<IModuleListProps> = ({ project_id }) => {
	const { data: modules, isFetching } = useQuery(getModulesOptions({ project_id }));
	const { setCreateModuleModal } = useModalsStore();

	return (
		<Section
			icon={<IconBlocks />}
			title="Modules"
			orientation="vertical"
			infoSlot={
				<Badge size={"lg"} variant={"solid"} transition={"opacity 200ms"} opacity={isFetching ? 1 : 0}>
					Sync
				</Badge>
			}
			actionsSlot={
				<IconButton variant={"ghost"} onClick={() => setCreateModuleModal()}>
					<IconPlus />
				</IconButton>
			}
		>
			{modules?.map((module) => {
				return <ModuleItem key={module.id} module={module} />;
			})}
		</Section>
	);
};
