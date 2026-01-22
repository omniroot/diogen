import { useEffect, useState } from "react";
import { create } from "zustand";

type DrawerName = "activity" | "journal" | "day-select";
type DrawerType = "view" | "create" | "update" | "delete";

interface Drawer {
	name: DrawerName;
	type?: DrawerType;
}

interface DrawersStore {
	drawers: Drawer[];
	open: (drawer: Drawer) => void;
	close: (drawerName: string) => void;
	closeAll: () => void;
	isOpen: (drawerName: string) => boolean;
	toggle: (drawer: Drawer) => void;
	getDrawer: (drawerName: string) => Drawer | undefined;
}

export const useDrawersStore = create<DrawersStore>((set, get) => ({
	drawers: [],
	closeAll: () => set({ drawers: [] }),
	open: (drawer) => {
		if (get().isOpen(drawer.name)) return;
		set((prev) => ({ drawers: [...prev.drawers, drawer] }));
	},
	close: (drawerName) =>
		set((prev) => ({ drawers: prev.drawers.filter((m) => m.name !== drawerName) })),
	isOpen: (drawerName) => {
		return get().drawers.some((m) => m.name === drawerName);
	},
	toggle: (drawer) => {
		if (get().isOpen(drawer.name)) {
			get().close(drawer.name);
		} else {
			get().open(drawer);
		}
	},
	getDrawer: (drawerName) => {
		return get().drawers.find((m) => m.name === drawerName);
	},
}));

export const useDrawers = (name: DrawerName) => {
	const {
		drawers,
		closeAll: _closeAll,
		open: _open,
		close: _close,
		toggle: _toggle,
		isOpen: _isOpen,
		getDrawer: _getDrawer,
	} = useDrawersStore();
	const [isOpen, setIsOpen] = useState(_isOpen(name));
	const [isAnyOpen, setIsAnyOpen] = useState(drawers.length > 0);
	const [currentDrawer, setCurrentDrawer] = useState<Drawer | undefined>(
		_getDrawer(name),
	);

	const open = (drawer: Drawer) => {
		_open(drawer);
	};
	const close = () => {
		_close(name);
	};

	const toggle = (drawerType: DrawerType, type: "open" | "replace" = "open") => {
		if (type === "replace") {
			_closeAll();
		}
		_toggle({ name, type: drawerType });
	};

	console.log({ drawers });

	useEffect(() => {
		setIsOpen(_isOpen(name));
		setIsAnyOpen(drawers.length > 0);
		setCurrentDrawer(_getDrawer(name));
	}, [drawers, name, _isOpen, _getDrawer]);

	return {
		drawers,
		modals: drawers,
		open,
		close,
		toggle,
		isOpen,
		isAnyOpen,
		currentDrawer,
	};
};
