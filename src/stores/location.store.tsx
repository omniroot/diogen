import { getProjectOptions } from "@/api/queries/projects.api.ts";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect, useLayoutEffect } from "react";
import { create } from "zustand";

interface ILocations {
  custom_id: string | null;
  module_id: string | null;
  issue_id: string | null;
}

interface ILocationStore extends ILocations {
  setLocations: (newLocations: Partial<ILocations>) => void;
}
export const useLocationStore = create<ILocationStore>((set) => ({
  custom_id: null,
  module_id: null,
  issue_id: null,
  setLocations: (newLocations) => set({ ...newLocations }),
}));

export const useLocationHandler = () => {
  const { setLocations } = useLocationStore();
  const params = useParams({ strict: false });
  const { data: project } = useQuery(
    getProjectOptions({ custom_id: params.custom_id })
  );
  //  const { data: project } = useQuery(
  //   getTasOptions({ custom_id: params.custom_id })
  // );

  useLayoutEffect(() => {
    setLocations({ ...params });
  }, [params]);

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
