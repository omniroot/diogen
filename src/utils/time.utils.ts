import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);

/**
 * Converts a UTC ISO string to a local time string (HH:mm).
 * @param isoString - The UTC ISO string.
 * @param defaultValue - The default value to return if the input is null or undefined.
 * @returns The local time string in "HH:mm" format.
 */
export const UTCISOToLocalTime = (
  isoString?: string | null,
  defaultValue = "",
): string => {
  if (!isoString) {
    return defaultValue;
  }
  // Parse the UTC string and convert it to the local timezone, then format.
  return dayjs(isoString).local().format("HH:mm");
};

interface UTCSleepTimes {
  sleep_start: string;
  sleep_end: string;
}

/**
 * Converts local sleep start and end times to UTC ISO strings,
 * correctly handling overnight sleeping.
 * @param sleep_start - The local sleep start time string in "HH:mm" format.
 * @param sleep_end - The local sleep end time string in "HH:mm" format.
 * @param referenceDate - The reference date for the start of sleep.
 * @returns An object containing the UTC ISO strings for sleep_start and sleep_end.
 */
export const getUTCSleepTimes = (
  { sleep_start, sleep_end }: UTCSleepTimes,
  referenceDate: Date | string,
): { sleep_start: string; sleep_end: string } => {
  const startDate = dayjs(referenceDate);

  // Combine date and time, assuming local timezone
  const sleepStartDateTime = dayjs(
    `${startDate.format("YYYY-MM-DD")}T${sleep_start}`,
  );
  let sleepEndDateTime = dayjs(
    `${startDate.format("YYYY-MM-DD")}T${sleep_end}`,
  );

  // If sleep end time is on or before start time, it must be on the next day
  if (sleepEndDateTime.isSameOrBefore(sleepStartDateTime)) {
    sleepEndDateTime = sleepEndDateTime.add(1, "day");
  }

  return {
    sleep_start: sleepStartDateTime.utc().format(),
    sleep_end: sleepEndDateTime.utc().format(),
  };
};
