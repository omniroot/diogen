# Миграция данных: Переход на ISO-UTC формат

Этот документ описывает процесс миграции существующих данных на новый формат хранения времени (ISO-UTC).

## 📋 Обзор

Если в вашей БД уже есть записи с временем в старом формате (например, просто "22:00" без даты и timezone), их необходимо мигрировать в новый формат ISO-UTC.

## 🔍 Проверка необходимости миграции

### Как понять, нужна ли миграция?

Проверьте формат данных в БД:

```typescript
const dayRecord = await getDayRecord();
console.log(dayRecord.sleep_start);
```

**Нужна миграция, если:**
- `sleep_start: "22:00"` (только время)
- `sleep_start: "2024-01-15 22:00"` (дата + время без timezone)
- `sleep_start: 1705345200` (timestamp в секундах/миллисекундах)

**Миграция не нужна, если:**
- `sleep_start: "2024-01-15T19:00:00.000Z"` (ISO-UTC формат)
- `sleep_start: null` или `sleep_start: undefined` (нет данных)

## 🛠️ Варианты миграции

### Вариант 1: Ручная миграция (рекомендуется для малого количества записей)

Если у вас мало записей (< 100), можно мигрировать их вручную через скрипт:

```typescript
import { localTimeToISO } from "@/utils/datetime.utils";
import { tablesDB, daysRecordsTable } from "@/api/appwrite";
import dayjs from "dayjs";

async function migrateManually() {
  // Получаем все записи
  const { rows } = await tablesDB.listRows({
    databaseId: String(daysRecordsTable?.databaseId),
    tableId: String(daysRecordsTable?.$id),
  });

  for (const record of rows) {
    // Пропускаем, если уже в ISO формате
    if (record.sleep_start?.includes('T') && record.sleep_start?.includes('Z')) {
      console.log(`Record ${record.$id} already migrated`);
      continue;
    }

    // Пропускаем, если нет данных
    if (!record.sleep_start || !record.date) {
      console.log(`Record ${record.$id} has no sleep data`);
      continue;
    }

    // СЛУЧАЙ 1: Формат "HH:mm" (только время)
    if (record.sleep_start.match(/^\d{1,2}:\d{2}$/)) {
      const sleepStartISO = localTimeToISO(record.date, record.sleep_start);
      
      // Определяем дату конца (может быть следующий день)
      let endDate = record.date;
      if (record.sleep_end) {
        const [startH] = record.sleep_start.split(':').map(Number);
        const [endH] = record.sleep_end.split(':').map(Number);
        if (endH < startH) {
          endDate = dayjs(record.date).add(1, 'day').format('YYYY-MM-DD');
        }
      }
      
      const sleepEndISO = record.sleep_end 
        ? localTimeToISO(endDate, record.sleep_end)
        : null;

      // Обновляем запись
      await tablesDB.updateRow({
        databaseId: String(daysRecordsTable?.databaseId),
        tableId: String(daysRecordsTable?.$id),
        rowId: record.$id,
        data: {
          sleep_start: sleepStartISO,
          sleep_end: sleepEndISO,
        },
      });

      console.log(`Migrated record ${record.$id}`);
    }
    
    // СЛУЧАЙ 2: Формат "YYYY-MM-DD HH:mm" (дата + время без timezone)
    else if (record.sleep_start.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/)) {
      const [date, time] = record.sleep_start.split(' ');
      const sleepStartISO = localTimeToISO(date, time);
      
      let sleepEndISO = null;
      if (record.sleep_end) {
        const [endDate, endTime] = record.sleep_end.split(' ');
        sleepEndISO = localTimeToISO(endDate, endTime);
      }

      await tablesDB.updateRow({
        databaseId: String(daysRecordsTable?.databaseId),
        tableId: String(daysRecordsTable?.$id),
        rowId: record.$id,
        data: {
          sleep_start: sleepStartISO,
          sleep_end: sleepEndISO,
        },
      });

      console.log(`Migrated record ${record.$id}`);
    }
    
    // СЛУЧАЙ 3: Timestamp в миллисекундах
    else if (typeof record.sleep_start === 'number') {
      const sleepStartISO = new Date(record.sleep_start).toISOString();
      const sleepEndISO = record.sleep_end 
        ? new Date(record.sleep_end).toISOString()
        : null;

      await tablesDB.updateRow({
        databaseId: String(daysRecordsTable?.databaseId),
        tableId: String(daysRecordsTable?.$id),
        rowId: record.$id,
        data: {
          sleep_start: sleepStartISO,
          sleep_end: sleepEndISO,
        },
      });

      console.log(`Migrated record ${record.$id}`);
    }
  }

  console.log('Migration complete!');
}

// Запуск миграции
migrateManually().catch(console.error);
```

### Вариант 2: Автоматическая миграция при загрузке (для постепенного перехода)

Если вы хотите мигрировать данные постепенно, можно добавить логику миграции в API слой:

```typescript
// src/api/queries/days_records.api.ts

import { localTimeToISO } from "@/utils/datetime.utils";
import dayjs from "dayjs";

// Функция для проверки и миграции записи
const migrateRecordIfNeeded = async (record: DaysRecords): Promise<DaysRecords> => {
  // Проверяем, нужна ли миграция
  const needsMigration = 
    record.sleep_start && 
    !record.sleep_start.includes('T') && 
    !record.sleep_start.includes('Z');

  if (!needsMigration) {
    return record; // Уже в правильном формате
  }

  // Выполняем миграцию
  const sleepStartISO = localTimeToISO(record.date, record.sleep_start);
  
  let endDate = record.date;
  if (record.sleep_end) {
    const [startH] = record.sleep_start.split(':').map(Number);
    const [endH] = record.sleep_end.split(':').map(Number);
    if (endH < startH) {
      endDate = dayjs(record.date).add(1, 'day').format('YYYY-MM-DD');
    }
  }
  
  const sleepEndISO = record.sleep_end 
    ? localTimeToISO(endDate, record.sleep_end)
    : null;

  // Обновляем в БД
  const updated = await tablesDB.updateRow({
    databaseId: String(daysRecordsTable?.databaseId),
    tableId: String(daysRecordsTable?.$id),
    rowId: record.$id,
    data: {
      sleep_start: sleepStartISO,
      sleep_end: sleepEndISO,
    },
  });

  console.log(`Auto-migrated record ${record.$id}`);
  return updated;
};

// Обновляем useGetDayRecordByDate
export const useGetDayRecordByDate = (
  vars: UseGetDayRecordByDate,
  overrides: Partial<UseQueryOptions<DaysRecords>> = {},
) => {
  const key = keyFactory.days_records.one({ vars });
  return useQuery<DaysRecords>({
    queryKey: key,
    queryFn: async () => {
      const { rows } = await tablesDB.listRows<DaysRecords>({
        databaseId: String(daysRecordsTable?.databaseId),
        tableId: String(daysRecordsTable?.$id),
        queries: [Query.equal("date", vars.date)],
        total: false,
      });
      
      const record = rows[0] || null;
      
      // Автоматически мигрируем при получении
      if (record) {
        return await migrateRecordIfNeeded(record);
      }
      
      return record;
    },
    ...overrides,
  });
};
```

### Вариант 3: Полная пересоздание данных (для критичных случаев)

Если старые данные некорректны или их структура сильно отличается:

```typescript
async function recreateAllRecords() {
  // 1. Экспортируем старые данные
  const oldRecords = await exportOldData();
  
  // 2. Очищаем таблицу (ОСТОРОЖНО!)
  // await clearTable();
  
  // 3. Создаем новые записи в правильном формате
  for (const oldRecord of oldRecords) {
    await createDayRecord({
      date: oldRecord.date,
      sleep_start: localTimeToISO(oldRecord.date, oldRecord.sleep_start),
      sleep_end: localTimeToISO(oldRecord.date, oldRecord.sleep_end),
      sleep_score: oldRecord.sleep_score,
    });
  }
}
```

## 🧪 Тестирование миграции

### Перед миграцией:

1. **Создайте бэкап БД** - обязательно!
2. **Протестируйте на копии данных**
3. **Проверьте несколько записей вручную**

```typescript
// Скрипт для проверки
async function testMigration() {
  const testRecord = await getDayRecord("2024-01-15");
  
  console.log("Before:", testRecord.sleep_start); // "22:00"
  
  // Выполняем миграцию
  await migrateRecord(testRecord);
  
  const updated = await getDayRecord("2024-01-15");
  console.log("After:", updated.sleep_start); // "2024-01-15T19:00:00.000Z"
  
  // Проверяем отображение
  const displayed = isoToLocalTime(updated.sleep_start);
  console.log("Displayed:", displayed); // "22:00"
  
  if (displayed === "22:00") {
    console.log("✅ Migration successful!");
  } else {
    console.error("❌ Migration failed!");
  }
}
```

### После миграции:

1. **Проверьте несколько записей вручную**
2. **Откройте UI и убедитесь, что время отображается корректно**
3. **Создайте новую запись и убедитесь, что она сохраняется правильно**
4. **Проверьте вычисление продолжительности**

## 📊 Примеры миграции данных

### До миграции:
```json
{
  "$id": "abc123",
  "date": "2024-01-15",
  "sleep_start": "22:00",
  "sleep_end": "07:00",
  "sleep_score": 85
}
```

### После миграции:
```json
{
  "$id": "abc123",
  "date": "2024-01-15",
  "sleep_start": "2024-01-15T19:00:00.000Z",
  "sleep_end": "2024-01-16T04:00:00.000Z",
  "sleep_score": 85
}
```

## ⚠️ Важные замечания

1. **Timezone assumption**: Если старые данные не содержали информацию о timezone, миграция будет использовать **текущий timezone пользователя**. Это может быть неточно, если данные вводились в другом timezone.

2. **Переход через полночь**: Скрипт миграции автоматически определяет, когда сон заканчивается на следующий день (если время конца < времени начала).

3. **Бэкап**: **ОБЯЗАТЕЛЬНО** создайте бэкап перед миграцией!

4. **Тестирование**: Тестируйте миграцию сначала на копии данных или на нескольких записях.

5. **Rollback**: Подготовьте план отката на случай проблем.

## 🔄 Rollback (откат миграции)

Если что-то пошло не так:

```typescript
async function rollbackMigration(backup: DaysRecords[]) {
  for (const record of backup) {
    await tablesDB.updateRow({
      databaseId: String(daysRecordsTable?.databaseId),
      tableId: String(daysRecordsTable?.$id),
      rowId: record.$id,
      data: record,
    });
  }
  console.log('Rollback complete');
}
```

## ✅ Чек-лист миграции

- [ ] Создан бэкап БД
- [ ] Выбран метод миграции (ручная/автоматическая)
- [ ] Протестирована миграция на тестовых данных
- [ ] Проверены edge cases (переход через полночь, null значения)
- [ ] Выполнена миграция на реальных данных
- [ ] Проверено отображение в UI
- [ ] Проверено сохранение новых записей
- [ ] Подготовлен план rollback

## 🆘 Помощь

Если возникли проблемы:

1. Проверьте консоль браузера на ошибки
2. Проверьте формат данных в БД
3. Убедитесь, что timezone определяется корректно
4. Проверьте, что все утилиты импортированы правильно

При необходимости откатитесь к бэкапу и попробуйте снова.