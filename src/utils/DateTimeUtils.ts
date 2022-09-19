export function getWeekDayName(weekDay: number | undefined): string {
  if (weekDay === undefined) return '';
  const weekDayNames: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return weekDayNames[weekDay - 1];
}