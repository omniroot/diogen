import { useKeyPress } from "@siberiacancode/reactuse";
import { IssueCreateModal } from "@/features/issues/modals/IssueCreateModal.tsx";
// import { ModuleCreateModal } from "@/features/modules/modals/ModuleCreateModal.tsx";
// import { ModuleDeleteModal } from "@/features/modules/modals/ModuleDeleteModal.tsx";
// import { ModuleUpdateModal } from "@/features/modules/modals/ModuleUpdateModal.tsx";
import { useModals } from "@/stores/modals.store.tsx";

export interface IIssueModal {
	open: boolean;
	onChange: (newState?: boolean) => void;
}

export const IssueModal = () => {
	const { isOpen, open, close, mode, isAnyOpen } = useModals("issue");

	useKeyPress("n", (_, event) => {
		// setCreateModuleModal(true);
		if (!isAnyOpen()) {
			console.log("N pressed");
			open("create");
			event.preventDefault();
			return;
		}
	});

	if (mode === "create")
		return (
			<IssueCreateModal
				open={isOpen}
				onChange={(newState) => {
					if (newState) {
						open("create");
					} else {
						close();
					}
				}}
			/>
		);

	// if (mode === "update")
	// 	return (
	// 		<ModuleUpdateModal
	// 			open={isOpen}
	// 			onChange={(newState) => {
	// 				if (newState) {
	// 					open("create");
	// 				} else {
	// 					close();
	// 				}
	// 			}}
	// 		/>
	// 	);

	// if (mode === "delete")
	// 	return (
	// 		<ModuleDeleteModal
	// 			open={isOpen}
	// 			onChange={(newState) => {
	// 				if (newState) {
	// 					open(mode);
	// 				} else {
	// 					close();
	// 				}
	// 			}}
	// 		/>
	// 	);
};
