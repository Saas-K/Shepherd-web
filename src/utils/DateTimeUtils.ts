import { numberPadLeft } from './StringUtils';

const weekDayNames: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function getWeekDayName(weekDay: number | undefined): string {
  if (weekDay === undefined) return '';
  return weekDayNames[weekDay - 1];
}

export function getWeekDates(today: Date): Date[] {
  const week: Date[] = [];
  const offset: number = today.getDay() === 0 ? 7 : today.getDay();
  today.setDate((today.getDate() - offset + 1));
  for (let i = 0; i < 7; i++) {
      week.push(
          new Date(today)
      ); 
      today.setDate(today.getDate() + 1);
  }
  return week;
}

export function getWeekDatesFormatted(today: Date): string[] {
  const week: string[] = []; 
  const offset: number = today.getDay() === 0 ? 7 : today.getDay();
  today.setDate((today.getDate() - offset + 1));
  for (let i = 0; i < 7; i++) {
    const _date: Date = new Date(today);
    week.push(
        `${_date.getFullYear()}-${numberPadLeft(_date.getMonth() + 1)}-${numberPadLeft(_date.getDate())}`
    ); 
    today.setDate(today.getDate() + 1);
  }
  return week; 
}

export function getFullCalendarTime(now: string | undefined): string {
  if (now === undefined) return '';
  return now.substring(11, 16);
}

export function getFullCalendarDate(now: string | undefined): string {
  console.log(now);
  if (now === undefined) return '';
  return now.substring(0, 10);
}

export function getWeekDayNow(now: Date | undefined | null): number {
  if (!now) return -1;
  return now.getDay() === 0 ? 7 : now.getDay();
}

export function getYearMonth(year: number, month: number): string {
  return `${year}-${numberPadLeft(month)}`;
}

export function getDate(weekDates: string[], weekDay: number | undefined, timeAt: string | undefined): string {
  return weekDay && timeAt ? `${weekDates.at(weekDay - 1)}T${timeAt}` : '';
}

/**
 * 
 * @param date 'yyyy-mm-dd' | 'yyyy-mm'
 * @returns [yyyy, mm, dd]
 */
export function parseNumberYearMonthDate(date: string | undefined): number[] | null {
  if (!date) return null;

  const parts: string[] = date.split('-');
  const partsNumber: number = parts.length;
  if (partsNumber === 2) {
    return [+parts[0], +parts[1]];
  }
  return [+parts[0], +parts[1], +parts[2]];
}