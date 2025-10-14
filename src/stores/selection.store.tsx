import type { IIssue } from "@/api/supabase.ts";
import { create } from "zustand";

interface ISelectionStore {
	issues: IIssue[];
	getIsSelected: (issue: IIssue | null | undefined) => boolean;
	toggleIssue: (issue: IIssue | null | undefined) => void;
}
export const useSelectionStore = create<ISelectionStore>((set, get) => ({
	issues: [],
	getIsSelected: (issue) => {
		if (!issue) return false;
		console.log("@getIsSelected ", get().issues, issue);
		return get().issues.filter((i) => i.id === issue.id).length > 0;
	},
	toggleIssue: (issue) => {
		if (!issue) return null;
		const isExist = get().issues.filter((i) => i.id === issue.id).length > 0;
		if (isExist) {
			set((state) => ({
				issues: state.issues.filter((i) => i.id !== issue.id),
			}));
		} else {
			set((state) => ({
				issues: [...state.issues, issue],
			}));
		}
	},
}));

// export const useSelectionHandler = () => {
//   const { setSelection } = useSelectionStore();
//   const params = useParams({ strict: false });
//   const { data: project } = useQuery(getProjectOptions({ custom_id: params.custom_id }));
//   //  const { data: project } = useQuery(
//   //   getTasOptions({ custom_id: params.custom_id })
//   // );

//   useLayoutEffect(() => {
//     setLocations({ ...params, project_id: project?.id || -99999 });
//   }, [params, setLocations, project]);

//   useEffect(() => {
//     let title = "Diogen";
//     if (project) {
//       title += ` | ${project.title}`;
//     }
//     if (params.issue_id) {
//       title += ` | ${params.issue_id}`;
//     }
//     document.title = title;
//   }, [params, project]);

//   console.log(params);
// };
