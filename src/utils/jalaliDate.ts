
import { format, parse, addDays, addMonths, addYears, isAfter, isBefore, isEqual } from 'date-fns-jalali';

// Format Jalali date in Persian text
export const formatJalaliDate = (date: Date, formatString: string = 'yyyy/MM/dd'): string => {
  return format(date, formatString);
};

// Parse Jalali date string to Date object
export const parseJalaliDate = (dateString: string, formatString: string = 'yyyy/MM/dd'): Date => {
  return parse(dateString, formatString, new Date());
};

// Get current Jalali date as string
export const getCurrentJalaliDate = (formatString: string = 'yyyy/MM/dd'): string => {
  return formatJalaliDate(new Date(), formatString);
};

// Convert Gregorian date to Jalali date string
export const gregorianToJalali = (date: Date, formatString: string = 'yyyy/MM/dd'): string => {
  return formatJalaliDate(date, formatString);
};

// Add days to Jalali date and get result as string
export const addDaysToJalali = (date: Date, days: number, formatString: string = 'yyyy/MM/dd'): string => {
  const newDate = addDays(date, days);
  return formatJalaliDate(newDate, formatString);
};

// Add months to Jalali date and get result as string
export const addMonthsToJalali = (date: Date, months: number, formatString: string = 'yyyy/MM/dd'): string => {
  const newDate = addMonths(date, months);
  return formatJalaliDate(newDate, formatString);
};

// Add years to Jalali date and get result as string
export const addYearsToJalali = (date: Date, years: number, formatString: string = 'yyyy/MM/dd'): string => {
  const newDate = addYears(date, years);
  return formatJalaliDate(newDate, formatString);
};

// Check if Jalali date is after another date
export const isJalaliDateAfter = (date: Date, dateToCompare: Date): boolean => {
  return isAfter(date, dateToCompare);
};

// Check if Jalali date is before another date
export const isJalaliDateBefore = (date: Date, dateToCompare: Date): boolean => {
  return isBefore(date, dateToCompare);
};

// Check if Jalali date is equal to another date
export const isJalaliDateEqual = (date: Date, dateToCompare: Date): boolean => {
  return isEqual(date, dateToCompare);
};

// Get Persian month name
export const getJalaliMonthName = (month: number): string => {
  const monthNames = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند'
  ];
  return monthNames[month - 1];
};

// Get Persian day of week name
export const getJalaliDayOfWeekName = (day: number): string => {
  const dayNames = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
  return dayNames[day];
};

// Format Jalali date in Persian text representation
export const formatJalaliDatePersian = (date: Date): string => {
  const year = format(date, 'yyyy');
  const month = parseInt(format(date, 'MM'));
  const day = format(date, 'dd');
  const dayOfWeek = date.getDay();
  
  return `${getJalaliDayOfWeekName(dayOfWeek)}، ${day} ${getJalaliMonthName(month)} ${year}`;
};

// Format date difference in Persian words (امروز، دیروز، فردا)
export const formatJalaliRelativeDate = (date: Date): string => {
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);
  
  if (isJalaliDateEqual(date, today)) {
    return 'امروز';
  } else if (isJalaliDateEqual(date, tomorrow)) {
    return 'فردا';
  } else if (isJalaliDateEqual(date, yesterday)) {
    return 'دیروز';
  }
  
  return formatJalaliDatePersian(date);
};
