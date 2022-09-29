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

export function getPrevYearMonth(date: Date): number[] {
  const _year = date.getFullYear();
  const _month = date.getMonth() + 1;

  if (_month === 1) {
    return [_year - 1, 12];
  }
  return [_year, _month - 1];
}

export function getNextYearMonth(date: Date): number[] {
  const _year = date.getFullYear();
  const _month = date.getMonth() + 1;

  if (_month === 12) {
    return [_year + 1, 1];
  }
  return [_year, _month + 1];
}

export function compareYearMonth(date1: Date, date2: Date): number {
  const _date1Year = date1.getFullYear();
  const _date1Month = date1.getMonth() + 1;
  const _date2Year = date2.getFullYear();
  const _date2Month = date2.getMonth() + 1;

  const _yearCmp = _date1Year - _date2Year;
  const _monthCmp = _date1Month - _date2Month;

  if (_yearCmp > 0) {
    return 1;
  }
  if (_yearCmp < 0) {
    return -1;
  }

  if (_monthCmp > 0) {
    return 1;
  }
  if (_monthCmp < 0) {
    return -1;
  }
  return 0;
}

export function compareYearMonthStr(date1: string | undefined, date2: string | undefined): number {
  if (!date1 || !date2) return 0;
  const _date1Parts: number[] | null = parseNumberYearMonthDate(date1);
  const _date2Parts: number[] | null = parseNumberYearMonthDate(date2);

  if (!_date1Parts || !_date2Parts) return 0;
  const _date1Year = _date1Parts[0];
  const _date1Month = _date1Parts[1];
  const _date2Year = _date2Parts[0];;
  const _date2Month = _date2Parts[1];

  const _yearCmp = _date1Year - _date2Year;
  const _monthCmp = _date1Month - _date2Month;

  if (_yearCmp > 0) {
    return 1;
  }
  if (_yearCmp < 0) {
    return -1;
  }

  if (_monthCmp > 0) {
    return 1;
  }
  if (_monthCmp < 0) {
    return -1;
  }
  return 0;
}