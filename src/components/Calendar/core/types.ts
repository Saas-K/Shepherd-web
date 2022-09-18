export interface IDayClassInfo {
  id: string,
  courseId: string,
  courseName: string,
  weekDay: number,
  begin: string,
  end: string,
  mainDayClassId: string,
  mainDayClassDate?: string,
  date?: string,
  active: boolean
}