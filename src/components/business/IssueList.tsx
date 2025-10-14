import { getIssuesOptions, type IGetIssuesOptions } from "@/api/queries/issues.api.ts";
import { IssueItem } from "@/components/business/IssueItem.tsx";
import { Section } from "@/components/business/Section.tsx";
import { useModalsStore } from "@/stores/modals.store.tsx";
import { IconButton, Skeleton } from "@chakra-ui/react";
import { IconCopyCheck, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";

type IIssueList = IGetIssuesOptions;

export const IssueList: FC<IIssueList> = (opts) => {
	const setCreateIssueList = useModalsStore((state) => state.setCreateIssueModal);
	const { data: issues, isFetching } = useQuery({
		...getIssuesOptions(opts),
		enabled: !!opts.project_id,
	});

	console.log({ issues, opts });

	return (
		<Section
			icon={<IconCopyCheck />}
			title="Issues"
			actionsSlot={
				<IconButton onClick={() => setCreateIssueList()} variant="ghost">
					<IconPlus />
				</IconButton>
			}
		>
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
