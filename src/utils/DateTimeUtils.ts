import { numberPadLeft } from './StringUtils';

export function getWeekDayName(weekDay: number | undefined): string {
  if (weekDay === undefined) return '';
  const weekDayNames: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
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

export function getWeekDayNow(now: Date | undefined | null): number {
  if (!now) return -1;
  return now.getDay() === 0 ? 7 : now.getDay();
}