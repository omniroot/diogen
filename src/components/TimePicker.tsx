import { Box, HStack, Input } from "@chakra-ui/react";
import { animated, useSpring } from "@react-spring/web";
import { useState } from "react";

// анимированные компоненты
const AnimatedBox = animated(Box);
const AnimatedInput = animated(Input);

export function TimePickerSplit() {
	const [split, setSplit] = useState(false);

	// анимация контейнера
	const containerStyles = useSpring({
		width: split ? 300 : 180,
		config: { tension: 220, friction: 18 },
	});

	// анимация opacity для двух полей
	const leftAnim = useSpring({ opacity: split ? 1 : 0 });
	const rightAnim = useSpring({ opacity: split ? 1 : 0 });

	return (
		<AnimatedBox
			style={containerStyles}
			p={4}
			border="1px solid"
			borderColor="gray.300"
			borderRadius="md"
			cursor="pointer"
			onClick={() => setSplit(!split)}
		>
			{!split && <Input value="12:15" readOnly textAlign="center" />}

			{split && (
				<HStack gap={3}>
					<AnimatedInput
						style={leftAnim}
						placeholder="Часы"
						defaultValue="12"
						maxW="50px"
					/>
					<AnimatedInput
						style={rightAnim}
						placeholder="Минуты"
						defaultValue="15"
						maxW="50px"
					/>
				</HStack>
			)}
		</AnimatedBox>
	);
}
