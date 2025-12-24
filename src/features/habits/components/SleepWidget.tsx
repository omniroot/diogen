import {
	Button,
	Dialog,
	HStack,
	Icon,
	Input,
	Portal,
	Slider,
	Spacer,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useVirtualKeyboard } from "@siberiacancode/reactuse";
import { IconMoon, } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
	useGetDayRecordByDate,
	useUpdateDayRecord,
} from "@/api/queries/days_records.api.ts";
import { useHabitsStore } from "@/stores/habits.store.tsx";

export const SleepWidget = () => {
	const { opened } = useVirtualKeyboard();
	const [screenHeight, setScreenHeight] = useState(window.innerHeight);
	const [keyboardHeight, setKeyboardHeight] = useState(0);
	const { selectedDate, setDaySelectOpen } = useHabitsStore();
	// const { data: daysRecords } = useGetDaysRecords({});
	const { data: dayRecord, refetch } = useGetDayRecordByDate(
		{ date: dayjs(selectedDate).format("YYYY-MM-DD") },
		{ enabled: !!selectedDate },
	);

	const { mutate: updateDayRecord } = useUpdateDayRecord();

	const { Field, handleSubmit, state } = useForm({
		defaultValues: {
			sleep_start: dayRecord?.sleep_start || "22:00",
			sleep_end: dayRecord?.sleep_end || "07:00",
			sleep_score: [dayRecord?.sleep_score || 80],
		},
		onSubmit: ({ value: { sleep_start, sleep_end, sleep_score } }) => {
			console.log({ sleep_start, sleep_end });
			if (!dayRecord) return;
			updateDayRecord(
				{
					id: dayRecord?.$id,
					vars: { sleep_start, sleep_end, sleep_score: sleep_score[0] },
				},
				{
					onSuccess: () => {
						refetch();
					},
				},
			);
		},
	});

	useEffect(() => {
		const handleResize = () => {
			if (window.visualViewport) {
				const newHeight = window.visualViewport.height;
				const heightDifference = screenHeight - newHeight;

				setKeyboardHeight(heightDifference > 0 ? heightDifference : 0);
			}
		};

		window.visualViewport?.addEventListener("resize", handleResize);

		// Сохраняем высоту экрана при инициализации
		setScreenHeight(
			window.visualViewport ? window.visualViewport.height : window.innerHeight,
		);

		return () => {
			window.visualViewport?.removeEventListener("resize", handleResize);
		};
	}, [screenHeight]);

	return (
		<Dialog.Root placement={opened ? "center" : "bottom"}>
			<Dialog.Trigger asChild>
				<HStack
					w={"100%"}
					p={2}
					gap={1}
					justifyContent={"space-between"}
					alignItems={"start"}
					border={"2px solid {colors.outline}"}
					borderRadius={"md"}
				>
					<VStack>
						<HStack h={"100%"} gap={2} alignItems={"center"}>
							<Icon size={"lg"}>
								<IconMoon />
							</Icon>
							<Text fontSize={"xl"} fontWeight={"bold"}>
								Sleep
							</Text>
						</HStack>
						{dayRecord?.sleep_start && <Text>{dayRecord?.sleep_start}</Text>}
						{dayRecord?.sleep_end && <Text>{dayRecord?.sleep_end}</Text>}
						{dayRecord?.sleep_score && <Text>{dayRecord?.sleep_score}</Text>}
					</VStack>
					<HStack h={"100%"}>
						123
						{/* <IconButton onClick={() => setDaySelectOpen(true)}>
							<IconEdit />
						</IconButton> */}
					</HStack>
				</HStack>
			</Dialog.Trigger>
			<Portal>
				<Dialog.Backdrop>
					<Spacer h={"200px"} />
					<Text>Opened: {String(opened)}</Text>
					<Text>screenHeight: {String(screenHeight)}</Text>
					<Text>keyboardHeight: {String(keyboardHeight)}</Text>
				</Dialog.Backdrop>
				<Dialog.Positioner>
					<Dialog.Content>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSubmit();
							}}
						>
							<Dialog.Header>
								<Dialog.Title>Sleep</Dialog.Title>
							</Dialog.Header>
							<Dialog.Body>
								<HStack>
									<Field name="sleep_start">
										{({ state, handleChange }) => (
											<Input
												w={"100%"}
												placeholder="Time start"
												value={state.value}
												onChange={(e) => handleChange(e.target.value)}
											/>
										)}
									</Field>
									<Field name="sleep_end">
										{({ state, handleChange }) => (
											<Input
												w={"100%"}
												placeholder="Time end"
												value={state.value}
												onChange={(e) => handleChange(e.target.value)}
											/>
										)}
									</Field>
								</HStack>
								<Spacer h={4} />
								<Field name="sleep_score">
									{({ state, handleChange }) => (
										<Slider.Root
											defaultValue={[30]}
											value={state.value}
											onValueChange={(e) => handleChange(e.value)}
										>
											<Slider.Control>
												<Slider.Track bg="surface_container_highest">
													<Slider.Range bg="primary" />
												</Slider.Track>
												<Slider.Thumbs bg={"primary"} />
											</Slider.Control>
											<Slider.ValueText />
										</Slider.Root>
									)}
								</Field>

								<Spacer h={4} />
								<Button type="submit" w={"100%"}>
									Сохранить
								</Button>
								<Spacer h={2} />
							</Dialog.Body>
						</form>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
};
