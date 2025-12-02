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
import { IconMoon } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import {
  useGetDayRecordByDate,
  useUpdateDayRecord,
} from "@/api/queries/days_records.api.ts";
import { useHabitsStore } from "@/stores/habits.store.tsx";
import {
  calculateSleepDuration,
  getUserTimezone,
  isoToLocalTime,
  localTimeToISO,
  normalizeTimeInput,
} from "@/utils/datetime.utils.ts";

export const SleepWidget = () => {
  const { opened } = useVirtualKeyboard();
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const { selectedDate } = useHabitsStore();

  const { data: dayRecord, refetch } = useGetDayRecordByDate(
    { date: dayjs(selectedDate).format("YYYY-MM-DD") },
    { enabled: !!selectedDate },
  );

  const { mutate: updateDayRecord } = useUpdateDayRecord();

  // Конвертируем ISO времена из БД в локальное время для отображения
  const localSleepStart = isoToLocalTime(dayRecord?.sleep_start);
  const localSleepEnd = isoToLocalTime(dayRecord?.sleep_end);

  const { Field, handleSubmit, reset } = useForm({
    defaultValues: {
      sleep_start: localSleepStart || "22:00",
      sleep_end: localSleepEnd || "07:00",
      sleep_score: [dayRecord?.sleep_score || 80],
    },
    onSubmit: ({ value: { sleep_start, sleep_end, sleep_score } }) => {
      if (!dayRecord) return;

      const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD");

      // Конвертируем локальное время в ISO-UTC для сохранения
      // Для начала сна используем выбранную дату
      const sleepStartISO = localTimeToISO(
        selectedDateStr,
        normalizeTimeInput(sleep_start),
      );

      // Для конца сна: если время конца меньше времени начала, значит это следующий день
      let sleepEndDate = selectedDateStr;
      const [startHours, startMinutes] = sleep_start.split(":").map(Number);
      const [endHours, endMinutes] = sleep_end.split(":").map(Number);

      if (
        endHours < startHours ||
        (endHours === startHours && endMinutes < startMinutes)
      ) {
        // Конец сна на следующий день
        sleepEndDate = dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD");
      }

      const sleepEndISO = localTimeToISO(
        sleepEndDate,
        normalizeTimeInput(sleep_end),
      );

      console.log("Saving to DB:", {
        sleep_start: sleepStartISO,
        sleep_end: sleepEndISO,
        sleep_score: sleep_score[0],
      });

      updateDayRecord(
        {
          id: dayRecord?.$id,
          vars: {
            sleep_start: sleepStartISO,
            sleep_end: sleepEndISO,
            sleep_score: sleep_score[0],
          },
        },
        {
          onSuccess: () => {
            refetch();
          },
        },
      );
    },
  });

  // Обновляем форму когда данные из БД загрузились
  useEffect(() => {
    if (dayRecord) {
      reset({
        sleep_start: isoToLocalTime(dayRecord.sleep_start) || "22:00",
        sleep_end: isoToLocalTime(dayRecord.sleep_end) || "07:00",
        sleep_score: [dayRecord.sleep_score || 80],
      });
    }
  }, [dayRecord, reset]);

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

  // Вычисляем продолжительность сна
  const sleepDuration = calculateSleepDuration(
    dayRecord?.sleep_start,
    dayRecord?.sleep_end,
  );

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
          <VStack alignItems={"flex-start"} gap={1}>
            <HStack h={"100%"} gap={2} alignItems={"center"}>
              <Icon size={"lg"}>
                <IconMoon />
              </Icon>
              <Text fontSize={"xl"} fontWeight={"bold"}>
                Sleep
              </Text>
            </HStack>
            <VStack alignItems={"flex-start"} gap={0.5} fontSize={"sm"}>
              {dayRecord?.sleep_start && (
                <Text>Start: {isoToLocalTime(dayRecord.sleep_start)}</Text>
              )}
              {dayRecord?.sleep_end && (
                <Text>End: {isoToLocalTime(dayRecord.sleep_end)}</Text>
              )}
              {sleepDuration && <Text>Duration: {sleepDuration}h</Text>}
              {dayRecord?.sleep_score && (
                <Text>Score: {dayRecord.sleep_score}</Text>
              )}
            </VStack>
          </VStack>
          <HStack h={"100%"}>
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
                <VStack gap={4}>
                  <HStack w={"100%"}>
                    <Field name="sleep_start">
                      {({ state, handleChange }) => (
                        <VStack alignItems={"flex-start"} w={"100%"}>
                          <Text fontSize={"sm"} fontWeight={"medium"}>
                            Sleep start
                          </Text>
                          <Input
                            w={"100%"}
                            type="time"
                            placeholder="Time start"
                            value={state.value}
                            onChange={(e) => handleChange(e.target.value)}
                          />
                        </VStack>
                      )}
                    </Field>
                    <Field name="sleep_end">
                      {({ state, handleChange }) => (
                        <VStack alignItems={"flex-start"} w={"100%"}>
                          <Text fontSize={"sm"} fontWeight={"medium"}>
                            Sleep end
                          </Text>
                          <Input
                            w={"100%"}
                            type="time"
                            placeholder="Time end"
                            value={state.value}
                            onChange={(e) => handleChange(e.target.value)}
                          />
                        </VStack>
                      )}
                    </Field>
                  </HStack>

                  <VStack w={"100%"} alignItems={"flex-start"}>
                    <Text fontSize={"sm"} fontWeight={"medium"}>
                      Sleep quality
                    </Text>
                    <Field name="sleep_score">
                      {({ state, handleChange }) => (
                        <Slider.Root
                          w={"100%"}
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
                  </VStack>
                </VStack>
              </Dialog.Body>
              <Dialog.Footer>
                <VStack w={"100%"}>
                  <Text color={"subtext2"}>{getUserTimezone()}</Text>
                  <Button type="submit" w={"100%"}>
                    Сохранить
                  </Button>
                </VStack>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
