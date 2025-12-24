// useResizable.ts
import { useEffect, useRef } from "react";

type Direction = "right"; // сейчас фокусируемся на правой стороне

export function useResizable(
	direction: Direction = "right",
	opts?: {
		minWidth?: number;
		maxWidth?: number;
	},
) {
	const containerRef = useRef<HTMLElement | null>(null);
	const handleRef = useRef<HTMLDivElement | null>(null);

	const minWidth = opts?.minWidth ?? 40;
	const maxWidth = opts?.maxWidth ?? Infinity;

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		// Стили контейнера (гарантируем position)
		const prevPosition = container.style.position;
		if (!prevPosition || prevPosition === "") {
			container.style.position = "relative";
		}

		// Создаём handle
		const handle = document.createElement("div");
		handleRef.current = handle;
		handle.setAttribute("aria-hidden", "true");
		Object.assign(handle.style, {
			position: "absolute",
			top: "0",
			right: "0",
			height: "100%",
			width: "12px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			cursor: "ew-resize", // <-- курсор для горизонтального ресайза
			zIndex: "10",
			userSelect: "none",
			touchAction: "none", // важен для pointer events / touch
			background: "transparent",
		} as CSSStyleDeclaration);

		// Inline SVG (горизонтальная стрелка). Небольшая иконка, не требует React.
		handle.innerHTML = `
      <svg width="12" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M8 7L4 12L8 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 7L20 12L16 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 12H20" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
		// Опционально чуть подсветить иконку
		(handle.firstElementChild as SVGElement | null)?.setAttribute(
			"style",
			"opacity:0.6;",
		);

		container.appendChild(handle);

		let startX = 0;
		let startWidth = 0;
		let pointerId: number | null = null;

		const onPointerDown = (e: PointerEvent) => {
			// Только левая кнопка или касание/стилус
			if (e.button && e.button !== 0) return;
			e.preventDefault();

			pointerId = e.pointerId;
			(e.target as Element).setPointerCapture(pointerId);

			// начальные значения — берём width через getBoundingClientRect (избежим боковых рассинхронов)
			startX = e.clientX;
			startWidth = container.getBoundingClientRect().width;

			// блокируем выбор текста в документе
			document.body.style.userSelect = "none";
			document.body.style.pointerEvents = "auto";

			window.addEventListener("pointermove", onPointerMove);
			window.addEventListener("pointerup", onPointerUp);
			window.addEventListener("pointercancel", onPointerUp);
		};

		const onPointerMove = (e: PointerEvent) => {
			if (pointerId !== null && e.pointerId !== pointerId) return;

			const deltaX = e.clientX - startX;
			// Для правой стороны: прибавляем delta
			let newWidth = startWidth + deltaX;

			// clamp
			if (newWidth < minWidth) newWidth = minWidth;
			if (newWidth > maxWidth) newWidth = maxWidth;

			// Применяем в пикселях — используем style.width чтобы не ломать layout вычисления
			container.style.width = `${Math.round(newWidth)}px`;
		};

		const onPointerUp = (e: PointerEvent) => {
			if (pointerId !== null && e.pointerId !== pointerId) return;

			// снятие capture если возможно
			try {
				(e.target as Element).releasePointerCapture?.(pointerId!);
			} catch {
				// ignore
			}

			pointerId = null;
			document.body.style.userSelect = "";
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("pointercancel", onPointerUp);
		};

		handle.addEventListener("pointerdown", onPointerDown);

		// Cleanup
		return () => {
			handle.removeEventListener("pointerdown", onPointerDown);
			try {
				container.removeChild(handle);
			} catch {}
			container.style.position = prevPosition;
			document.body.style.userSelect = "";
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("pointercancel", onPointerUp);
		};
	}, [direction, minWidth, maxWidth]);

	return containerRef;
}
