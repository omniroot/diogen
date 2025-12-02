# Diogen

Web app for planning pet project.

## 📅 DateTime Utilities

Система работы с датами и временем использует **ISO-UTC как единую точку правды**.

### Быстрый старт

```typescript
import { localTimeToISO, isoToLocalTime } from "@/utils/datetime.utils";

// Сохранение в БД
const iso = localTimeToISO("2024-01-15", "22:00");
await save({ sleep_start: iso }); // "2024-01-15T19:00:00.000Z"

// Отображение пользователю
const local = isoToLocalTime("2024-01-15T19:00:00.000Z");
console.log(local); // "22:00"
```

### Документация

- **Quick Start**: [`docs/DATETIME_QUICKSTART.md`](docs/DATETIME_QUICKSTART.md) - краткое руководство
- **Full Documentation**: [`docs/DATETIME_HANDLING.md`](docs/DATETIME_HANDLING.md) - полная документация
- **Examples**: [`docs/DATETIME_EXAMPLES.md`](docs/DATETIME_EXAMPLES.md) - примеры кода
- **Changes Summary**: [`docs/DATETIME_CHANGES_SUMMARY.md`](docs/DATETIME_CHANGES_SUMMARY.md) - сводка изменений

### Главное правило

❌ **Неправильно**: `await save({ time: "22:00" })`

✅ **Правильно**: `await save({ time: localTimeToISO(date, "22:00") })`

## Api

- [ ] Query keys
  - [ ] Issues
  - [ ] Modules
  - [ ] Projects
