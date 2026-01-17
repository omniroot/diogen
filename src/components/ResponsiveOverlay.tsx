import {
	CloseButton,
	Drawer,
	Portal,
	useBreakpointValue,
	useDisclosure,
} from "@chakra-ui/react";
import { type FC, type ReactNode, useEffect } from "react";

/**
 * Предполагаемые клавиши-«специальные» (через строковые имена, как в KeyboardEvent.key).
 * Для одиночных букв и цифр можно передавать просто строку длины 1: 'm', 'A', '1' и т.д.
 */
export type SpecialKey =
	| "Escape"
	| "Enter"
	| "Space"
	| "Tab"
	| "Backspace"
	| "Delete"
	| "ArrowUp"
	| "ArrowDown"
	| "ArrowLeft"
	| "ArrowRight"
	| "Home"
	| "End"
	| "PageUp"
	| "PageDown";

export type ShortcutKey = SpecialKey | string;

export interface Props {
	title?: string;
	open?: boolean;
	onOpenChange?: (newValue: boolean) => void;
	defaultOpen?: boolean;
	shortcuts?: ShortcutKey[];
	children?: ReactNode;
	// drawerPlacement?: DrawerRootProps["placement"];
	// closeOnEsc?: boolean;
}

export const UniversalModal: FC<Props> = ({
	children,
	open: outsideOpen,
	onOpenChange,
	title,
	shortcuts,
	defaultOpen = false,
}) => {
	const { open, setOpen } = useDisclosure({
		defaultOpen: defaultOpen,
		open: outsideOpen,
	});
	const isDesktopBreakpoint = useBreakpointValue({ base: false, md: true });
	const listenForShortcuts = Boolean(isDesktopBreakpoint);

	useEffect(() => {
		if (!listenForShortcuts || !shortcuts || shortcuts.length === 0) return;

		const handler = (e: KeyboardEvent) => {
			// простые защиты: не реагируем если модификаторы или удержание
			if (e.repeat) return;
			if (e.ctrlKey || e.altKey || e.metaKey) return;

			const active = document.activeElement as HTMLElement | null;
			if (
				active &&
				(active.tagName === "INPUT" ||
					active.tagName === "TEXTAREA" ||
					active.isContentEditable)
			)
				return;

			const key = e.key;

			for (const s of shortcuts) {
				if (!s) continue;
				// одиночный символ — сравниваем case-insensitive
				if (s.length === 1) {
					if (key.length === 1 && key.toLowerCase() === s.toLowerCase()) {
						setOpen(true);
						e.preventDefault();
						return;
					}
				} else {
					// многосимвольные имена (Escape, Enter и т.д.) — сравниваем точечно
					if (key === s) {
						setOpen(true);
						e.preventDefault();
						return;
					}
				}
			}
		};

		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [listenForShortcuts, shortcuts, setOpen]);

	const _onOpenChange = (newState: boolean) => {
		setOpen(newState);
		onOpenChange?.(newState);
	};

	return (
		<Drawer.Root
			open={open}
			onOpenChange={(v) => _onOpenChange(v.open)}
			placement={isDesktopBreakpoint ? "end" : "bottom"}
			size={isDesktopBreakpoint ? "md" : "xs"}
		>
			<Portal>
				<Drawer.Backdrop backdropFilter={"blur(5px)"} bg={"surface/5"} />
				<Drawer.Positioner>
					<Drawer.Content
						bg={"surface"}
						color={"on-surface"}
						border={"1px solid {colors.outline}"}
						borderRadius={"21px"}
					>
						<Drawer.Header>
							<Drawer.Title>{title ?? "Drawer Title"}</Drawer.Title>
						</Drawer.Header>
						<Drawer.Body>
							{/* <p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
								tempor incididunt ut labore et dolore magna aliqua.
							</p> */}
							{children}
						</Drawer.Body>
						{/* <Drawer.Footer>
							<Button variant="outline">Cancel</Button>
							<Button>Save</Button>
						</Drawer.Footer> */}
						<Drawer.CloseTrigger asChild>
							<CloseButton size="sm" />
						</Drawer.CloseTrigger>
					</Drawer.Content>
				</Drawer.Positioner>
			</Portal>
		</Drawer.Root>
	);
};

/**
 * UniversalModal
 * - на больших экранах показывает Modal (диалог),
 * - на мобильных / tablet — Drawer.
 *
 * Поведение шорткатов:
 * - слушает keydown только если мы на десктопном брейкпойнте (md+) или
 *   если у устройства "точный" указатель (matchMedia('(pointer: fine)')).
 *   Это — аппроксимация "есть внешняя клавиатура / десктоп" — точного стандарта
 *   для определения внешней клавиатуры в браузерах нет.
 * - игнорирует события если в фокусе input/textarea или contentEditable,
 *   либо если нажаты модификаторы (Ctrl/Alt/Meta).
 */
// export default function UniversalModal({
// 	isOpen: controlledIsOpen,
// 	defaultOpen = false,
// 	onOpen,
// 	onClose,
// 	shortcuts = [],
// 	title,
// 	children,
// 	size = "md",
// 	drawerPlacement = "right",
// 	closeOnEsc = true,
// }: UniversalModalProps) {
// 	const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
// 	const isControlled = typeof controlledIsOpen === "boolean";
// 	const isOpen = isControlled ? controlledIsOpen! : internalOpen;

// 	const setOpen = (v: boolean) => {
// 		if (!isControlled) setInternalOpen(v);
// 		if (v) onOpen?.();
// 		else onClose?.();
// 	};

// 	// Определяем "десктопность" через брейкпоинты и точный указатель.
// 	// md и выше считаем "десктоп-по умолчанию" — поменяйте на ваш breakpoints если нужно.
// 	const isDesktopBreakpoint = useBreakpointValue({ base: false, md: true });
// 	const [hasFinePointer] = useMediaQuery("(pointer: fine)");
// 	const listenForShortcuts = Boolean(isDesktopBreakpoint || hasFinePointer);

// 	useEffect(() => {
// 		if (!listenForShortcuts || !shortcuts || shortcuts.length === 0) return;

// 		const handler = (e: KeyboardEvent) => {
// 			// простые защиты: не реагируем если модификаторы или удержание
// 			if (e.repeat) return;
// 			if (e.ctrlKey || e.altKey || e.metaKey) return;

// 			const active = document.activeElement as HTMLElement | null;
// 			if (
// 				active &&
// 				(active.tagName === "INPUT" ||
// 					active.tagName === "TEXTAREA" ||
// 					active.isContentEditable)
// 			)
// 				return;

// 			const key = e.key;

// 			for (const s of shortcuts) {
// 				if (!s) continue;
// 				// одиночный символ — сравниваем case-insensitive
// 				if (s.length === 1) {
// 					if (key.length === 1 && key.toLowerCase() === s.toLowerCase()) {
// 						setOpen(true);
// 						e.preventDefault();
// 						return;
// 					}
// 				} else {
// 					// многосимвольные имена (Escape, Enter и т.д.) — сравниваем точечно
// 					if (key === s) {
// 						setOpen(true);
// 						e.preventDefault();
// 						return;
// 					}
// 				}
// 			}
// 		};

// 		window.addEventListener("keydown", handler);
// 		return () => window.removeEventListener("keydown", handler);
// 	}, [listenForShortcuts, shortcuts, isControlled]);

// 	// Рендерим Modal на десктопе, Drawer на mobile/tablet
// 	if (isDesktopBreakpoint) {
// 		return (
// 			<Modal
// 				isOpen={isOpen}
// 				onClose={() => setOpen(false)}
// 				closeOnEsc={closeOnEsc}
// 				size={size as any}
// 			>
// 				<ModalOverlay />
// 				<ModalContent>
// 					<ModalHeader>{title}</ModalHeader>
// 					<ModalCloseButton />
// 					<ModalBody>{children}</ModalBody>
// 				</ModalContent>
// 			</Modal>
// 		);
// 	}

// 	return (
// 		<Drawer
// 			isOpen={isOpen}
// 			placement={drawerPlacement}
// 			onClose={() => setOpen(false)}
// 			size={size as any}
// 		>
// 			<DrawerOverlay />
// 			<DrawerContent>
// 				<DrawerCloseButton />
// 				<DrawerHeader>{title}</DrawerHeader>
// 				<DrawerBody>{children}</DrawerBody>
// 			</DrawerContent>
// 		</Drawer>
// 	);
