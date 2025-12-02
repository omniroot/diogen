# Примеры использования datetime утилит

Этот файл содержит практические примеры использования утилит для работы с датами и временем.

## Содержание

- [Базовые примеры](#базовые-примеры)
- [Работа с компонентами](#работа-с-компонентами)
- [Обработка edge cases](#обработка-edge-cases)
- [Типичные ошибки](#типичные-ошибки)

## Базовые примеры

### Пример 1: Сохранение времени начала и конца сна

```typescript
import { localTimeToISO } from "@/utils/datetime.utils";

// Пользователь выбрал дату и ввел время
const selectedDate = "2024-01-15"; // YYYY-MM-DD
const sleepStart = "23:00"; // Локальное время пользователя
const sleepEnd = "07:30";   // Локальное время пользователя

// Конвертируем в ISO-UTC для сохранения в БД
const sleepStartISO = localTimeToISO(selectedDate, sleepStart);
// Результат для UTC+3: "2024-01-15T20:00:00.000Z"

const sleepEndISO = localTimeToISO(selectedDate, sleepEnd);
// Результат для UTC+3: "2024-01-16T04:30:00.000Z"

// Сохраняем в БД
await saveToDB({
  sleep_start: sleepStartISO,
  sleep_end: sleepEndISO,
});
```

### Пример 2: Отображение времени из БД

```typescript
import { isoToLocalTime } from "@/utils/datetime.utils";

// Получаем данные из БД
const dayRecord = {
  sleep_start: "2024-01-15T20:00:00.000Z",
  sleep_end: "2024-01-16T04:30:00.000Z",
};

// Конвертируем для отображения пользователю
const displayStart = isoToLocalTime(dayRecord.sleep_start);
// Результат для UTC+3: "23:00"

const displayEnd = isoToLocalTime(dayRecord.sleep_end);
// Результат для UTC+3: "07:30"

console.log(`Sleep time: ${displayStart} - ${displayEnd}`);
// Вывод: "Sleep time: 23:00 - 07:30"
```

### Пример 3: Вычисление продолжительности сна

```typescript
import { calculateSleepDuration } from "@/utils/datetime.utils";

const dayRecord = {
  sleep_start: "2024-01-15T20:00:00.000Z",
  sleep_end: "2024-01-16T04:30:00.000Z",
};

const duration = calculateSleepDuration(
  dayRecord.sleep_start,
  dayRecord.sleep_end
);
// Результат: 8.5 (часов)

console.log(`You slept for ${duration} hours`);
// Вывод: "You slept for 8.5 hours"
```

## Работа с компонентами

### Пример 4: React компонент с отображением времени

```typescript
import { isoToLocalTime, calculateSleepDuration } from "@/utils/datetime.utils";

interface SleepCardProps {
  dayRecord: {
    sleep_start: string;
    sleep_end: string;
    sleep_score: number;
  };
}

const SleepCard = ({ dayRecord }: SleepCardProps) => {
  // Конвертируем времена для отображения
  const sleepStart = isoToLocalTime(dayRecord.sleep_start);
  const sleepEnd = isoToLocalTime(dayRecord.sleep_end);
  
  // Вычисляем продолжительность
  const duration = calculateSleepDuration(
    dayRecord.sleep_start,
    dayRecord.sleep_end
  );
  
  return (
    <div>
      <h3>Sleep Summary</h3>
      <p>Bedtime: {sleepStart}</p>
      <p>Wake up: {sleepEnd}</p>
      <p>Duration: {duration}h</p>
      <p>Quality: {dayRecord.sleep_score}/100</p>
    </div>
  );
};
```

### Пример 5: Форма с автоматическим обновлением

```typescript
import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { isoToLocalTime, localTimeToISO, normalizeTimeInput } from "@/utils/datetime.utils";
import dayjs from "dayjs";

const SleepForm = ({ dayRecord, selectedDate, onSave }) => {
  const { Field, handleSubmit, reset } = useForm({
    defaultValues: {
      sleep_start: isoToLocalTime(dayRecord?.sleep_start) || "22:00",
      sleep_end: isoToLocalTime(dayRecord?.sleep_end) || "07:00",
    },
    onSubmit: async ({ value }) => {
      const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD");
      
      // Конвертируем локальное время в ISO-UTC
      const sleepStartISO = localTimeToISO(
        selectedDateStr,
        normalizeTimeInput(value.sleep_start)
      );
      
      // Определяем дату конца (может быть следующий день)
      let sleepEndDate = selectedDateStr;
      const [startHours] = value.sleep_start.split(":").map(Number);
      const [endHours] = value.sleep_end.split(":").map(Number);
      
      if (endHours < startHours) {
        sleepEndDate = dayjs(selectedDate)
          .add(1, "day")
          .format("YYYY-MM-DD");
      }
      
      const sleepEndISO = localTimeToISO(
        sleepEndDate,
        normalizeTimeInput(value.sleep_end)
      );
      
      // Сохраняем
      await onSave({
        sleep_start: sleepStartISO,
        sleep_end: sleepEndISO,
      });
    },
  });
  
  // Обновляем форму при изменении данных
  useEffect(() => {
    if (dayRecord) {
      reset({
        sleep_start: isoToLocalTime(dayRecord.sleep_start) || "22:00",
        sleep_end: isoToLocalTime(dayRecord.sleep_end) || "07:00",
      });
    }
  }, [dayRecord, reset]);
  
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <Field name="sleep_start">
        {({ state, handleChange }) => (
          <input
            type="time"
            value={state.value}
            onChange={(e) => handleChange(e.target.value)}
          />
        )}
      </Field>
      
      <Field name="sleep_end">
        {({ state, handleChange }) => (
          <input
            type="time"
            value={state.value}
            onChange={(e) => handleChange(e.target.value)}
          />
        )}
      </Field>
      
      <button type="submit">Save</button>
    </form>
  );
};
```

## Обработка edge cases

### Пример 6: Переход через полночь

```typescript
import { localTimeToISO } from "@/utils/datetime.utils";
import dayjs from "dayjs";

const handleSleepWithMidnightCrossing = (
  selectedDate: string,
  sleepStart: string,
  sleepEnd: string
) => {
  const [startHours, startMinutes] = sleepStart.split(":").map(Number);
  const [endHours, endMinutes] = sleepEnd.split(":").map(Number);
  
  // Начало сна на выбранной дате
  const sleepStartISO = localTimeToISO(selectedDate, sleepStart);
  
  // Определяем дату конца
  let sleepEndDate = selectedDate;
  
  // Если конец раньше начала, значит это следующий день
  if (
    endHours < startHours ||
    (endHours === startHours && endMinutes < startMinutes)
  ) {
    sleepEndDate = dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD");
  }
  
  const sleepEndISO = localTimeToISO(sleepEndDate, sleepEnd);
  
  return {
    sleep_start: sleepStartISO,
    sleep_end: sleepEndISO,
  };
};

// Примеры использования:
// Сон в пределах одного дня (дневной сон)
const daySleep = handleSleepWithMidnightCrossing("2024-01-15", "14:00", "16:00");
// sleep_start: "2024-01-15T11:00:00.000Z" (для UTC+3)
// sleep_end: "2024-01-15T13:00:00.000Z" (для UTC+3)

// Сон через полночь (обычный ночной сон)
const nightSleep = handleSleepWithMidnightCrossing("2024-01-15", "23:00", "07:00");
// sleep_start: "2024-01-15T20:00:00.000Z" (для UTC+3)
// sleep_end: "2024-01-16T04:00:00.000Z" (для UTC+3)
```

### Пример 7: Обработка null/undefined значений

```typescript
import { isoToLocalTime, calculateSleepDuration } from "@/utils/datetime.utils";

const SafeSleepDisplay = ({ dayRecord }) => {
  // Утилиты безопасно обрабатывают null/undefined
  const sleepStart = isoToLocalTime(dayRecord?.sleep_start);
  const sleepEnd = isoToLocalTime(dayRecord?.sleep_end);
  const duration = calculateSleepDuration(
    dayRecord?.sleep_start,
    dayRecord?.sleep_end
  );
  
  if (!sleepStart || !sleepEnd) {
    return <div>No sleep data available</div>;
  }
  
  return (
    <div>
      <p>Sleep: {sleepStart} - {sleepEnd}</p>
      {duration && <p>Duration: {duration}h</p>}
    </div>
  );
};
```

### Пример 8: Валидация и нормализация ввода

```typescript
import { normalizeTimeInput, isValidTimeFormat } from "@/utils/datetime.utils";

const handleTimeInput = (timeString: string) => {
  // Нормализуем ввод (добавляем ведущие нули)
  const normalized = normalizeTimeInput(timeString);
  // "9:5" -> "09:05"
  // "14:30" -> "14:30"
  
  // Проверяем валидность
  if (!isValidTimeFormat(normalized)) {
    console.error("Invalid time format");
    return null;
  }
  
  return normalized;
};

// Примеры
console.log(handleTimeInput("9:30"));    // "09:30"
console.log(handleTimeInput("23:45"));   // "23:45"
console.log(handleTimeInput("25:00"));   // null (invalid)
console.log(handleTimeInput("abc"));     // null (invalid)
```

## Типичные ошибки

### ❌ Ошибка 1: Сохранение локального времени в БД

```typescript
// НЕПРАВИЛЬНО - сохраняем локальное время напрямую
const saveWrong = async () => {
  await updateRecord({
    sleep_start: "22:00", // Это только время, без даты и без информации о timezone
    sleep_end: "07:00",
  });
};

// ПРАВИЛЬНО - конвертируем в ISO-UTC
const saveCorrect = async () => {
  const date = "2024-01-15";
  await updateRecord({
    sleep_start: localTimeToISO(date, "22:00"),
    sleep_end: localTimeToISO(date, "07:00"),
  });
};
```

### ❌ Ошибка 2: Отображение ISO-UTC пользователю

```typescript
// НЕПРАВИЛЬНО - показываем ISO-UTC напрямую
const DisplayWrong = ({ dayRecord }) => (
  <div>
    Start: {dayRecord.sleep_start} {/* "2024-01-15T19:00:00.000Z" */}
  </div>
);

// ПРАВИЛЬНО - конвертируем в локальное время
const DisplayCorrect = ({ dayRecord }) => (
  <div>
    Start: {isoToLocalTime(dayRecord.sleep_start)} {/* "22:00" */}
  </div>
);
```

### ❌ Ошибка 3: Игнорирование перехода через полночь

```typescript
// НЕПРАВИЛЬНО - используем одну и ту же дату
const saveWrong = async () => {
  const date = "2024-01-15";
  const sleepStartISO = localTimeToISO(date, "23:00");
  const sleepEndISO = localTimeToISO(date, "07:00"); // Тоже 15-е число!
  
  // Результат: продолжительность сна = -16 часов (некорректно)
};

// ПРАВИЛЬНО - проверяем переход через полночь
const saveCorrect = async () => {
  const date = "2024-01-15";
  const sleepStart = "23:00";
  const sleepEnd = "07:00";
  
  const sleepStartISO = localTimeToISO(date, sleepStart);
  
  // Определяем дату конца
  let endDate = date;
  if (parseInt(sleepEnd.split(":")[0]) < parseInt(sleepStart.split(":")[0])) {
    endDate = dayjs(date).add(1, "day").format("YYYY-MM-DD");
  }
  
  const sleepEndISO = localTimeToISO(endDate, sleepEnd);
  // Теперь продолжительность = 8 часов (корректно)
};
```

### ❌ Ошибка 4: Двойная конвертация

```typescript
// НЕПРАВИЛЬНО - конвертируем дважды
const doubleConversion = (isoString: string) => {
  const localTime = isoToLocalTime(isoString); // Первая конвертация
  const backToISO = localTimeToISO(
    dayjs().format("YYYY-MM-DD"),
    localTime
  ); // Вторая конвертация
  
  // Результат может быть неправильным из-за разных дат
};

// ПРАВИЛЬНО - храним ISO-UTC, конвертируем только для отображения
const singleConversion = (isoString: string) => {
  // Просто отображаем
  return isoToLocalTime(isoString);
};
```

## Полезные советы

### 1. Используйте type="time" для input

```typescript
// HTML5 input type="time" автоматически обрабатывает формат HH:mm
<input
  type="time"
  value={localTime}
  onChange={(e) => setLocalTime(e.target.value)}
/>
```

### 2. Всегда проверяйте null/undefined

```typescript
const duration = calculateSleepDuration(
  dayRecord?.sleep_start,
  dayRecord?.sleep_end
);

// Проверяем результат перед использованием
if (duration !== null) {
  console.log(`Duration: ${duration}h`);
}
```

### 3. Логируйте ISO-UTC для отладки

```typescript
console.log("Saving to DB:", {
  sleep_start: sleepStartISO, // "2024-01-15T19:00:00.000Z"
  sleep_end: sleepEndISO,     // "2024-01-16T04:00:00.000Z"
  local_timezone: getUserTimezone(), // "Europe/Moscow"
});
```

### 4. Тестируйте с разными временными зонами

```typescript
// Симулируем разные временные зоны в тестах
describe("datetime with different timezones", () => {
  it("works in UTC+3 (Moscow)", () => {
    // мок временной зоны
  });
  
  it("works in UTC-5 (New York)", () => {
    // мок временной зоны
  });
  
  it("works in UTC+0 (London)", () => {
    // мок временной зоны
  });
});
```
