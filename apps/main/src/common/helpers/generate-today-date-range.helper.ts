/*
// utc based
export function generateTodayDateRange(): [Date, Date] {
  // get date based on local date
  const today = new Date();

  // convert to UTC
  const utcYear = today.getUTCFullYear();
  const utcMonth = today.getUTCMonth();
  const utcDate = today.getUTCDate();

  const todayDayStart = new Date(
    Date.UTC(utcYear, utcMonth, utcDate, 0, 0, 0, 0),
  );
  const todayDayEnd = new Date(
    Date.UTC(utcYear, utcMonth, utcDate, 23, 59, 59, 999),
  );

  return [todayDayStart, todayDayEnd];
}
*/

export function generateTodayDateRange(): [Date, Date] {
  const now = new Date();

  // get date based on local date
  const todayDayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );

  const todayDayEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );

  return [todayDayStart, todayDayEnd];
}

export function generateCustomDateRange(customDate: Date): [Date, Date] {
  const date = new Date(customDate);
  const dateStart = new Date(date.setHours(0, 0, 0, 0));
  const dateEnd = new Date(date.setHours(23, 59, 59, 999));

  return [dateStart, dateEnd];
}
