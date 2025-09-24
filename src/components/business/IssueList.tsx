import { Button, Skeleton } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { getIssuesOptions } from "@/api/queries/issues.api.ts";
import type { IIssue } from "@/api/supabase.interface.ts";
import { IssueItem } from "@/components/business/IssueItem/IssueItem.tsx";
import { Section } from "@/components/business/Section/Section.tsx";

interface IIssueList {
	project_id?: IIssue["project_id"];
}

export const IssueList: FC<IIssueList> = ({ project_id }) => {
	const { data: issues, isFetching } = useQuery({
		...getIssuesOptions({ project_id, count: "many" }),
		enabled: !!project_id,
	});

	console.log({ issues, project_id });

	return (
		<Section title="Issues" actionsSlot={<Button>Filters</Button>}>
			{issues?.map((issue) => {
				console.log("Render ", issue);

				return (
					<Skeleton key={issue.id} loading={isFetching} w={"100%"}>
						<IssueItem issue={issue} />
					</Skeleton>
				);
			})}
		</Section>
	);
};
