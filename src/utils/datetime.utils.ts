import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Получает текущую временную зону пользователя
 */
export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

/**
 * Конвертирует локальное время (HH:mm) в ISO datetime для конкретной даты
 * @param date - дата в формате YYYY-MM-DD
 * @param time - время в формате HH:mm
 * @returns ISO string в UTC
 *
 * @example
 * // Если пользователь в Москве (UTC+3) и вводит 22:00 на 2024-01-15
 * localTimeToISO("2024-01-15", "22:00")
 * // => "2024-01-15T19:00:00.000Z" (22:00 MSK = 19:00 UTC)
 */
export const localTimeToISO = (date: string, time: string): string => {
  const userTimezone = getUserTimezone();

  // Создаем дату в локальной временной зоне пользователя
  const localDateTime = dayjs.tz(
    `${date} ${time}`,
    "YYYY-MM-DD HH:mm",
    userTimezone,
  );

  // Конвертируем в UTC и возвращаем ISO string
  return localDateTime.utc().toISOString();
};

/**
 * Конвертирует ISO datetime в локальное время (HH:mm)
 * @param isoString - ISO datetime string в UTC
 * @returns время в формате HH:mm в локальной временной зоне
 *
 * @example
 * // Если пользователь в Москве (UTC+3)
 * isoToLocalTime("2024-01-15T19:00:00.000Z")
 * // => "22:00"
 */
export const isoToLocalTime = (
  isoString: string | null | undefined,
): string => {
  if (!isoString) return "";

  const userTimezone = getUserTimezone();

  // Парсим UTC время и конвертируем в локальную зону
  const localTime = dayjs.utc(isoString).tz(userTimezone);

  return localTime.format("HH:mm");
};

/**
 * Конвертирует ISO datetime в локальную дату
 * @param isoString - ISO datetime string в UTC
 * @returns дата в формате YYYY-MM-DD в локальной временной зоне
 */
export const isoToLocalDate = (
  isoString: string | null | undefined,
): string => {
  if (!isoString) return "";

  const userTimezone = getUserTimezone();
  const localDate = dayjs.utc(isoString).tz(userTimezone);

  return localDate.format("YYYY-MM-DD");
};

/**
 * Получает текущую дату в локальной временной зоне
 * @returns дата в формате YYYY-MM-DD
 */
export const getLocalToday = (): string => {
  const userTimezone = getUserTimezone();
  return dayjs().tz(userTimezone).format("YYYY-MM-DD");
};

/**
 * Получает текущее время в локальной временной зоне
 * @returns время в формате HH:mm
 */
export const getLocalNow = (): string => {
  const userTimezone = getUserTimezone();
  return dayjs().tz(userTimezone).format("HH:mm");
};

/**
 * Форматирует ISO datetime для отображения пользователю
 * @param isoString - ISO datetime string в UTC
 * @param format - формат dayjs (по умолчанию "DD.MM.YYYY HH:mm")
 * @returns отформатированная строка в локальной временной зоне
 */
export const formatISOForDisplay = (
  isoString: string | null | undefined,
  format: string = "DD.MM.YYYY HH:mm",
): string => {
  if (!isoString) return "";

  const userTimezone = getUserTimezone();
  return dayjs.utc(isoString).tz(userTimezone).format(format);
};

/**
 * Вычисляет продолжительность сна в часах
 * @param sleepStart - ISO datetime начала сна
 * @param sleepEnd - ISO datetime конца сна
 * @returns продолжительность в часах с точностью до 1 десятичного знака
 */
export const calculateSleepDuration = (
  sleepStart: string | null | undefined,
  sleepEnd: string | null | undefined,
): number | null => {
  if (!sleepStart || !sleepEnd) return null;

  const start = dayjs.utc(sleepStart);
  const end = dayjs.utc(sleepEnd);

  const durationInHours = end.diff(start, "hour", true);

  return Math.round(durationInHours * 10) / 10;
};

/**
 * Проверяет, является ли строка валидным временем в формате HH:mm
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Нормализует ввод времени (добавляет ведущие нули если нужно)
 * @param time - время в формате H:mm или HH:mm
 * @returns время в формате HH:mm
 */
export const normalizeTimeInput = (time: string): string => {
  if (!time) return "";

  const parts = time.split(":");
  if (parts.length !== 2) return time;

  const [hours, minutes] = parts;
  const normalizedHours = hours.padStart(2, "0");
  const normalizedMinutes = minutes.padStart(2, "0");

  return `${normalizedHours}:${normalizedMinutes}`;
};
