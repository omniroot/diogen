import { Badge, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { getModuleOptions } from "@/api/queries/modules.api.ts";

const route = getRouteApi("/modules/$module_id");

export const ModulePage = () => {
	const { module_id } = route.useParams();
	const { data: module } = useQuery(getModuleOptions({ id: Number(module_id) }));
	return (
		<div>
			<Text>{module?.title}</Text>
			<Text>{module?.description}</Text>
			<Badge size={"lg"}>{module?.status}</Badge>
		</div>
	);
};
