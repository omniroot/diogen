import { useKeyPress } from "@siberiacancode/reactuse";
import { ModuleCreateModal } from "@/features/modules/modals/ModuleCreateModal.tsx";
import { ModuleDeleteModal } from "@/features/modules/modals/ModuleDeleteModal.tsx";
import { ModuleUpdateModal } from "@/features/modules/modals/ModuleUpdateModal.tsx";
import { useModals } from "@/stores/modals.store.tsx";

export interface IModuleModal {
	open: boolean;
	onChange: (newState?: boolean) => void;
}

export const ModuleModal = () => {
	const { isOpen, open, close, mode, isAnyOpen } = useModals("module");

	useKeyPress("m", (_, event) => {
		// setCreateModuleModal(true);
		if (!isAnyOpen()) {
			console.log("M pressed");
			open("create");
			event.preventDefault();
			return;
		}
	});

	if (mode === "create")
		return (
			<ModuleCreateModal
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

	if (mode === "update")
		return (
			<ModuleUpdateModal
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

	if (mode === "delete")
		return (
			<ModuleDeleteModal
				open={isOpen}
				onChange={(newState) => {
					if (newState) {
						open(mode);
					} else {
						close();
					}
				}}
			/>
		);
};
