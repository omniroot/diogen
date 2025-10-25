import { IconButton, Skeleton } from "@chakra-ui/react";
import { IconCopyCheck, IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { getIssuesOptions, type IGetIssuesOptions } from "@/api/queries/issues.api.ts";
import { Section } from "@/components/business/Section.tsx";
import { IssueItem } from "@/features/issues/components/IssueItem";
import { useModals, useModalsStore } from "@/stores/modals.store.tsx";

type IIssueList = IGetIssuesOptions;

export const IssueList: FC<IIssueList> = (opts) => {
	const { open } = useModals("issue");
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
				<IconButton onClick={() => open("create")} variant="ghost">
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
