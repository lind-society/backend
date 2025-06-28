import { IDateRange } from '../interfaces';

export function generateDateRangeWithinOneDay(date: Date | string): IDateRange {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
  };
}

export function generateMonthDateRange(
  month: number,
  year?: number,
): IDateRange {
  const targetYear = year ?? new Date().getFullYear();

  const startDate = new Date(targetYear, month - 1, 1, 0, 0, 0, 0);
  const endDate = new Date(targetYear, month, 0, 23, 59, 59, 999);

  return { startDate, endDate };
}

export function generateYearDateRange(year: number) {
  const startDate = new Date(year, 0, 1, 0, 0, 0, 0);
  const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

  return { startDate, endDate };
}

export function generateDateRangeWithinDateInterval(
  startDate: Date | string,
  endDate: Date | string,
): IDateRange {
  const generatedStartDate = new Date(startDate);
  generatedStartDate.setHours(0, 0, 0, 0);

  const generatedEndDate = new Date(endDate);
  generatedEndDate.setHours(23, 59, 59, 999);

  return {
    startDate: generatedStartDate,
    endDate: generatedEndDate,
  };
}

