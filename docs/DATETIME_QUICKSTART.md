# DateTime Utilities - Quick Start

Быстрый старт для работы с датами и временем в приложении.

## 🎯 Главное правило

**В БД хранится только ISO-UTC. Всё остальное — в UI.**

```typescript
// ❌ НЕПРАВИЛЬНО
await saveToDb({ sleep_start: "22:00" });

// ✅ ПРАВИЛЬНО
const iso = localTimeToISO("2024-01-15", "22:00");
await saveToDb({ sleep_start: iso }); // "2024-01-15T19:00:00.000Z"
```

## 📦 Импорты

```typescript
import {
  localTimeToISO,        // Локальное время → ISO-UTC (для сохранения)
  isoToLocalTime,        // ISO-UTC → локальное время (для отображения)
  calculateSleepDuration,// Вычисление продолжительности
  normalizeTimeInput,    // Нормализация ввода (9:5 → 09:05)
  getUserTimezone,       // Получить timezone пользователя
} from "@/utils/datetime.utils";
```

## 💾 Сохранение в БД

```typescript
const selectedDate = "2024-01-15"; // YYYY-MM-DD
const sleepStart = "23:00";        // Локальное время пользователя
const sleepEnd = "07:00";          // Локальное время пользователя

// 1. Конвертируем начало
const sleepStartISO = localTimeToISO(selectedDate, sleepStart);

// 2. Проверяем переход через полночь
let endDate = selectedDate;
const [startH] = sleepStart.split(":").map(Number);
const [endH] = sleepEnd.split(":").map(Number);

if (endH < startH) {
  endDate = dayjs(selectedDate).add(1, "day").format("YYYY-MM-DD");
}

// 3. Конвертируем конец
const sleepEndISO = localTimeToISO(endDate, sleepEnd);

// 4. Сохраняем
await updateDayRecord({
  sleep_start: sleepStartISO,
  sleep_end: sleepEndISO,
});
```

## 📺 Отображение из БД

```typescript
const dayRecord = await getDayRecord(); // Получаем из БД

// Конвертируем для отображения
const displayStart = isoToLocalTime(dayRecord.sleep_start); // "23:00"
const displayEnd = isoToLocalTime(dayRecord.sleep_end);     // "07:00"

// Вычисляем продолжительность
const duration = calculateSleepDuration(
  dayRecord.sleep_start,
  dayRecord.sleep_end
); // 8 (часов)
```

## 🎨 Компонент с формой

```typescript
const SleepForm = ({ dayRecord, selectedDate }) => {
  const { Field, handleSubmit, reset } = useForm({
    defaultValues: {
      sleep_start: isoToLocalTime(dayRecord?.sleep_start) || "22:00",
      sleep_end: isoToLocalTime(dayRecord?.sleep_end) || "07:00",
    },
    onSubmit: ({ value }) => {
      const date = dayjs(selectedDate).format("YYYY-MM-DD");
      
      // Конвертируем в ISO-UTC
      const sleepStartISO = localTimeToISO(date, value.sleep_start);
      
      // Обрабатываем переход через полночь
      let endDate = date;
      if (parseInt(value.sleep_end.split(":")[0]) < 
          parseInt(value.sleep_start.split(":")[0])) {
        endDate = dayjs(date).add(1, "day").format("YYYY-MM-DD");
      }
      
      const sleepEndISO = localTimeToISO(endDate, value.sleep_end);
      
      // Сохраняем
      saveToDB({ sleep_start: sleepStartISO, sleep_end: sleepEndISO });
    },
  });
  
  // Обновляем форму при загрузке данных
  useEffect(() => {
    if (dayRecord) {
      reset({
        sleep_start: isoToLocalTime(dayRecord.sleep_start),
        sleep_end: isoToLocalTime(dayRecord.sleep_end),
      });
    }
  }, [dayRecord]);
  
  return (
    <form onSubmit={handleSubmit}>
      <Field name="sleep_start">
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

## 🔍 Компонент для отображения

```typescript
const SleepCard = ({ dayRecord }) => {
  // Конвертируем времена
  const start = isoToLocalTime(dayRecord?.sleep_start);
  const end = isoToLocalTime(dayRecord?.sleep_end);
  
  // Вычисляем продолжительность
  const duration = calculateSleepDuration(
    dayRecord?.sleep_start,
    dayRecord?.sleep_end
  );
  
  if (!start || !end) {
    return <div>No sleep data</div>;
  }
  
  return (
    <div>
      <p>Start: {start}</p>
      <p>End: {end}</p>
      {duration && <p>Duration: {duration}h</p>}
    </div>
  );
};
```

## ⚠️ Частые ошибки

### 1. Забыли конвертировать перед сохранением
```typescript
// ❌ НЕПРАВИЛЬНО
await save({ sleep_start: "22:00" });

// ✅ ПРАВИЛЬНО
await save({ sleep_start: localTimeToISO(date, "22:00") });
```

### 2. Показываем ISO-UTC пользователю
```typescript
// ❌ НЕПРАВИЛЬНО
<Text>{dayRecord.sleep_start}</Text> // "2024-01-15T19:00:00.000Z"

// ✅ ПРАВИЛЬНО
<Text>{isoToLocalTime(dayRecord.sleep_start)}</Text> // "22:00"
```

### 3. Не учитываем переход через полночь
```typescript
// ❌ НЕПРАВИЛЬНО - одна дата для начала и конца
const startISO = localTimeToISO("2024-01-15", "23:00");
const endISO = localTimeToISO("2024-01-15", "07:00"); // Неверно!

// ✅ ПРАВИЛЬНО - следующий день для конца
const startISO = localTimeToISO("2024-01-15", "23:00");
const endISO = localTimeToISO("2024-01-16", "07:00"); // Верно!
```

## 📚 Дополнительно

- **Полная документация**: `docs/DATETIME_HANDLING.md`
- **Примеры**: `docs/DATETIME_EXAMPLES.md`
- **Утилиты**: `src/utils/datetime.utils.ts`

## 🧪 Отладка

Логируйте ISO-UTC для проверки:

```typescript
console.log({
  saving: {
    sleep_start: sleepStartISO,
    sleep_end: sleepEndISO,
  },
  display: {
    start: isoToLocalTime(sleepStartISO),
    end: isoToLocalTime(sleepEndISO),
  },
  timezone: getUserTimezone(),
});
```

## ✅ Чек-лист

Перед коммитом проверьте:

- [ ] Все времена в БД в формате ISO-UTC
- [ ] Используется `localTimeToISO()` перед сохранением
- [ ] Используется `isoToLocalTime()` перед отображением
- [ ] Обработан переход через полночь (если применимо)
- [ ] Проверены null/undefined значения
- [ ] Input имеет `type="time"`
