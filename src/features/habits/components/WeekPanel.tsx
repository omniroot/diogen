import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

interface WeekDetail {
  day: number; // Число дня
  dayName: string; // Название дня
  fullDate: Date; // Объект даты
}

function getCurrentWeekDates(): WeekDetail[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  // If today is Sunday (0), subtract 6 days to get to Monday of the current week
  // Otherwise, subtract dayOfWeek - 1 to get to Monday
  const startOfWeek = today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
  const weekDetails: WeekDetail[] = [];

  const dayNames: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(startOfWeek + i);
    weekDetails.push({
      day: date.getDate(), // Число дня
      dayName: dayNames[i], // Название дня
      fullDate: date, // Объект даты
    });
  }

  return weekDetails;
}

function getIsToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

function isSelectedDate(date: Date, selectedDate: Date): boolean {
  return (
    date.getDate() === selectedDate.getDate() &&
    date.getMonth() === selectedDate.getMonth() &&
    date.getFullYear() === selectedDate.getFullYear()
  );
}

export const WeekPanel = () => {
  const days = getCurrentWeekDates();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // console.log(selectedDay);

  return (
    <HStack w="100%" justifyContent={"center"} gap={"4px"}>
      {days.map((day) => {
        const isToday = getIsToday(day.fullDate);
        const isSelected = isSelectedDate(day.fullDate, selectedDate);

        return (
          <VStack
            key={day.fullDate.toISOString()}
            w={"100%"}
            bg={{
              base: isSelected ? "surface_container" : "transparent",
              _hover: isSelected
                ? "surface_container_high"
                : "surface_container",
            }}
            transition={"backgrounds"}
            borderRadius={"18px"}
            borderWidth={isToday ? "2px" : "0px"}
            borderColor={"outline"}
            gap={"4px"}
            p={isSelected ? "12px 6px" : "12px 6px"}
            cursor={"pointer"}
            onClick={() => {
              setSelectedDate(day.fullDate);
            }}
          >
            <Text
              fontSize={"14px"}
              color={isSelected ? "text" : "subtext"}
              fontWeight={isSelected ? "bold" : "regular"}
            >
              {day.dayName}
            </Text>
            <Text
              fontSize={"16px"}
              fontWeight={isSelected ? "bold" : "regular"}
            >
              {day.day}
            </Text>
            <HStack gap={"1.5px"} justifyContent={"center"}>
              <Box
                w={"8px"}
                h={"8px"}
                borderWidth={"2px"}
                borderRadius={"50%"}
                borderColor={"red.500"}
              ></Box>
              <Box
                w={"8px"}
                h={"8px"}
                borderWidth={"2px"}
                borderRadius={"50%"}
                borderColor={"green.500"}
              ></Box>

              <Box
                w={"8px"}
                h={"8px"}
                borderWidth={"2px"}
                borderRadius={"50%"}
                borderColor={"blue.500"}
              ></Box>

              <Box
                w={"8px"}
                h={"8px"}
                borderWidth={"2px"}
                borderRadius={"50%"}
                borderColor={"orange.500"}
              ></Box>
            </HStack>
          </VStack>
        );
      })}
    </HStack>
  );
};
