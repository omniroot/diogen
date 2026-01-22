// interface Props {

import { HStack } from "@chakra-ui/react";
import { IconBriefcase, IconHome } from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import { useLayoutEffect, useRef, useState } from "react";

const paths = [
	{
		icon: <IconHome />,
		link: "/",
	},
	{
		icon: <IconBriefcase />,
		link: "/tasks",
	},
];

interface AnimationState {
	left: number;
	width: number;
	isExpanded: boolean;
	shouldAnimate: boolean;
}

// }
export const NavBar = () => {
	const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
	const [trailState, setTrailState] = useState<AnimationState>({
		left: 0,
		width: 0,
		isExpanded: false,
		shouldAnimate: false,
	});
	const [activePos, setActivePos] = useState({ left: 0, width: 0 });
	const prevIndexRef = useRef<number>(0);
	const current_path = useLocation().pathname;

	useLayoutEffect(() => {
		const activeIndex = paths.findIndex((p) => p.link === current_path);
		if (activeIndex !== -1 && itemsRef.current[activeIndex]) {
			const activeElement = itemsRef.current[activeIndex];
			const prevElement = itemsRef.current[prevIndexRef.current];

			if (activeElement) {
				requestAnimationFrame(() => {
					const newActivePos = {
						left: activeElement.offsetLeft,
						width: activeElement.clientWidth,
					};

					if (prevElement && activeIndex !== prevIndexRef.current) {
						// Calculate trail expansion
						const startLeft = Math.min(activeElement.offsetLeft, prevElement.offsetLeft);
						const endLeft = Math.max(activeElement.offsetLeft, prevElement.offsetLeft);
						const totalWidth = endLeft - startLeft + activeElement.clientWidth;

						// Move active indicator first (250ms), then animate trail collapse
						setActivePos(newActivePos);

						// Delay trail expansion slightly so it follows active indicator
						setTimeout(() => {
							setTrailState({
								left: startLeft,
								width: totalWidth,
								isExpanded: true,
								shouldAnimate: false,
							});
						}, 50);

						// After active indicator finishes moving, start trail animation
						setTimeout(() => {
							setTrailState({
								left: newActivePos.left,
								width: newActivePos.width,
								isExpanded: false,
								shouldAnimate: true,
							});
						}, 250);
					} else {
						// Initial position
						setTrailState({
							left: newActivePos.left,
							width: newActivePos.width,
							isExpanded: false,
							shouldAnimate: false,
						});
						setActivePos(newActivePos);
					}

					prevIndexRef.current = activeIndex;
				});
			}
		}
	}, [current_path]);

	return (
		<HStack
			position={"fixed"}
			bottom={"10px"}
			bg={"surface-container-high/85"}
			backdropFilter={"blur(10px)"}
			borderRadius={"full"}
			p={"8px 12px"}
			left={"50%"}
			translate={"-50%"}
			transition={"all 200ms"}
		>
			{/* Trail background */}
			<HStack
				color={"on-surface"}
				bg={"surface-container"}
				borderRadius={"full"}
				position={"absolute"}
				w={`${trailState.width}px`}
				h={"75%"}
				left={`${trailState.left}px`}
				transition={
					trailState.shouldAnimate ? "all 650ms cubic-bezier(0.34, 1, 0.64, 1)" : "none"
				}
			/>

			{/* Active indicator */}
			<HStack
				color={"on-primary"}
				bg={"primary"}
				borderRadius={"full"}
				position={"absolute"}
				w={`${activePos.width}px`}
				h={"75%"}
				left={`${activePos.left}px`}
				transition={"all 250ms cubic-bezier(0.34, 1, 0.64, 1)"}
			/>

			{/* Nav items */}
			{paths.map((path, index) => {
				return (
					<HStack
						key={path.link}
						ref={(el) => {
							itemsRef.current[index] = el;
						}}
						asChild
						py={3}
						px={8}
						color={current_path === path.link ? "on-primary" : "on-surface"}
						transition={"all 200ms"}
						position={"relative"}
						zIndex={2}
					>
						<Link to={path.link}>{path.icon}</Link>
					</HStack>
				);
			})}
		</HStack>
	);
};
