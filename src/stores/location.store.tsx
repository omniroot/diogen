import { useParams } from "@tanstack/react-router";
import { useEffect, useLayoutEffect } from "react";
import { create } from "zustand";
import { useGetProject } from "@/api/queries/projects.api.ts";

interface ILocations {
	project_id: number | null;
	custom_id: string | null;
	module_id: number | null;
	issue_id: string | null;
}

interface ILocationStore extends ILocations {
	setLocations: (newLocations: Partial<ILocations>) => void;
}
export const useLocationStore = create<ILocationStore>((set) => ({
	project_id: null,
	custom_id: null,
	module_id: null,
	issue_id: null,
	setLocations: (newLocations) => set({ ...newLocations }),
}));

export const useLocationHandler = () => {
	const { setLocations } = useLocationStore();
	const params = useParams({ strict: false });
	const { data: project, error } = useGetProject(
		{ custom_id: params.custom_id },
		{ enabled: !!params.custom_id },
	);

	console.log("@Location handler", error);

	useLayoutEffect(() => {
		setLocations({
			...params,
			module_id: Number(params.module_id),
			project_id: project?.id || -99999,
		});
	}, [params, setLocations, project]);

	useEffect(() => {
		let title = "Diogen";
		if (project) {
			title += ` | ${project.title}`;
		}
		if (params.issue_id) {
			title += ` | ${params.issue_id}`;
		}
		document.title = title;
	}, [params, project]);

	console.log(params);
};
