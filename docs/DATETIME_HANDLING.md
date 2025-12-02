# Работа с датами и временем в приложении

## Принципы

В этом приложении используется **единая точка правды (Single Source of Truth)** для работы с датами и временем:

- **Хранение в БД**: все даты и времена хранятся в формате **ISO-8601 в UTC** (например: `2024-01-15T19:00:00.000Z`)
- **Отображение в UI**: конвертация в локальное время пользователя происходит только на уровне UI
- **Ввод пользователя**: конвертация из локального времени в UTC происходит перед сохранением в БД

## Архитектура

```
┌─────────────┐
│  Database   │  ← ISO-UTC строки: "2024-01-15T19:00:00.000Z"
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  API Layer  │  ← Передает ISO-UTC без изменений
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  UI Layer   │  ← Конвертация в/из локального времени
└─────────────┘     Отображает: "22:00" (для UTC+3)
```

## Утилиты для работы с датами

Все утилиты находятся в файле `src/utils/datetime.utils.ts`.

### Основные функции

#### `localTimeToISO(date: string, time: string): string`

Конвертирует локальное время пользователя в ISO-UTC для сохранения в БД.

```typescript
// Пользователь в Москве (UTC+3) вводит 22:00 на дату 2024-01-15
const isoString = localTimeToISO("2024-01-15", "22:00");
// Результат: "2024-01-15T19:00:00.000Z"
```

#### `isoToLocalTime(isoString: string): string`

Конвертирует ISO-UTC из БД в локальное время для отображения пользователю.

```typescript
// В БД: "2024-01-15T19:00:00.000Z"
const localTime = isoToLocalTime("2024-01-15T19:00:00.000Z");
// Для пользователя в Москве (UTC+3): "22:00"
```

#### `isoToLocalDate(isoString: string): string`

Конвертирует ISO-UTC в локальную дату.

```typescript
const localDate = isoToLocalDate("2024-01-15T19:00:00.000Z");
// Для пользователя в Москве: "2024-01-15"
```

#### `calculateSleepDuration(sleepStart: string, sleepEnd: string): number`

Вычисляет продолжительность между двумя ISO-UTC временами.

```typescript
const duration = calculateSleepDuration(
  "2024-01-15T19:00:00.000Z",
  "2024-01-16T02:00:00.000Z"
);
// Результат: 7 (часов)
```

## Примеры использования

### Сохранение времени сна

```typescript
import { localTimeToISO } from "@/utils/datetime.utils";

const handleSaveSleep = (sleepStart: string, sleepEnd: string) => {
  const selectedDate = "2024-01-15"; // YYYY-MM-DD
  
  // Конвертируем локальное время в ISO-UTC
  const sleepStartISO = localTimeToISO(selectedDate, sleepStart);
  
  // Если конец сна на следующий день (например, начало 22:00, конец 07:00)
  let sleepEndDate = selectedDate;
  const [startHours] = sleepStart.split(":").map(Number);
  const [endHours] = sleepEnd.split(":").map(Number);
  
  if (endHours < startHours) {
    sleepEndDate = dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD");
  }
  
  const sleepEndISO = localTimeToISO(sleepEndDate, sleepEnd);
  
  // Сохраняем в БД
  await updateDayRecord({
    sleep_start: sleepStartISO,
    sleep_end: sleepEndISO,
  });
};
```

### Отображение времени сна

```typescript
import { isoToLocalTime, calculateSleepDuration } from "@/utils/datetime.utils";

const SleepDisplay = ({ dayRecord }) => {
  // Конвертируем из ISO-UTC в локальное время
  const sleepStart = isoToLocalTime(dayRecord.sleep_start);
  const sleepEnd = isoToLocalTime(dayRecord.sleep_end);
  
  // Вычисляем продолжительность
  const duration = calculateSleepDuration(
    dayRecord.sleep_start,
    dayRecord.sleep_end
  );
  
  return (
    <div>
      <p>Start: {sleepStart}</p>
      <p>End: {sleepEnd}</p>
      <p>Duration: {duration}h</p>
    </div>
  );
};
```

### Работа с формами

```typescript
import { isoToLocalTime, localTimeToISO } from "@/utils/datetime.utils";
import { useForm } from "@tanstack/react-form";

const SleepForm = ({ dayRecord }) => {
  const { Field, handleSubmit, reset } = useForm({
    defaultValues: {
      sleep_start: isoToLocalTime(dayRecord?.sleep_start) || "22:00",
      sleep_end: isoToLocalTime(dayRecord?.sleep_end) || "07:00",
    },
    onSubmit: ({ value }) => {
      const selectedDate = "2024-01-15";
      
      // Конвертируем обратно в ISO-UTC перед сохранением
      const sleepStartISO = localTimeToISO(selectedDate, value.sleep_start);
      const sleepEndISO = localTimeToISO(selectedDate, value.sleep_end);
      
      saveToDB({ sleep_start: sleepStartISO, sleep_end: sleepEndISO });
    },
  });
  
  // Обновляем форму при изменении данных из БД
  useEffect(() => {
    if (dayRecord) {
      reset({
        sleep_start: isoToLocalTime(dayRecord.sleep_start),
        sleep_end: isoToLocalTime(dayRecord.sleep_end),
      });
    }
  }, [dayRecord]);
  
  return <form onSubmit={handleSubmit}>...</form>;
};
```

## Важные моменты

### 1. Никогда не храните локальное время в БД

❌ **Неправильно:**
```typescript
// Сохраняем локальное время напрямую
await updateRecord({ sleep_start: "22:00" });
```

✅ **Правильно:**
```typescript
// Конвертируем в ISO-UTC перед сохранением
const sleepStartISO = localTimeToISO(date, "22:00");
await updateRecord({ sleep_start: sleepStartISO });
```

### 2. Всегда конвертируйте при отображении

❌ **Неправильно:**
```typescript
// Отображаем ISO-UTC напрямую
<Text>{dayRecord.sleep_start}</Text> // "2024-01-15T19:00:00.000Z"
```

✅ **Правильно:**
```typescript
// Конвертируем в локальное время
<Text>{isoToLocalTime(dayRecord.sleep_start)}</Text> // "22:00"
```

### 3. Обрабатывайте переход через полночь

Если время конца меньше времени начала, это означает, что событие заканчивается на следующий день:

```typescript
const sleepStart = "22:00"; // 22:00 текущего дня
const sleepEnd = "07:00";   // 07:00 следующего дня

// Определяем дату конца
let endDate = selectedDate;
if (endHours < startHours) {
  endDate = dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD");
}
```

### 4. Используйте type="time" для input

Для ввода времени используйте нативный input с типом "time":

```typescript
<Input
  type="time"
  value={localTime}
  onChange={(e) => setLocalTime(e.target.value)}
/>
```

Это обеспечивает:
- Нативный UI для выбора времени на мобильных устройствах
- Автоматическую валидацию формата HH:mm
- Лучший UX

## Тестирование

При тестировании функций работы со временем учитывайте разные временные зоны:

```typescript
describe("datetime utils", () => {
  it("should convert local time to ISO-UTC correctly", () => {
    // Мокируем временную зону
    jest.spyOn(Intl, "DateTimeFormat").mockReturnValue({
      resolvedOptions: () => ({ timeZone: "Europe/Moscow" }), // UTC+3
    });
    
    const result = localTimeToISO("2024-01-15", "22:00");
    expect(result).toBe("2024-01-15T19:00:00.000Z");
  });
});
```

## Зависимости

Для работы с датами используется библиотека `dayjs` с плагинами:
- `dayjs/plugin/utc` - для работы с UTC
- `dayjs/plugin/timezone` - для работы с временными зонами

Убедитесь, что они подключены в `datetime.utils.ts`:

```typescript
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);
```

## Troubleshooting

### Проблема: Время отображается неправильно

**Причина:** Возможно, данные в БД хранятся не в ISO-UTC формате.

**Решение:** Убедитесь, что при сохранении используется `localTimeToISO()`.

### Проблема: Время сдвигается на несколько часов

**Причина:** Двойная конвертация временной зоны.

**Решение:** Проверьте, что конвертация происходит только один раз - либо при сохранении, либо при отображении.

### Проблема: Неправильная дата при переходе через полночь

**Причина:** Не учитывается, что конец события может быть на следующий день.

**Решение:** Используйте логику определения даты конца события (см. раздел "Обрабатывайте переход через полночь").