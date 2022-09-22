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

export interface IMainDay {
  id: string,
  courseId: string,
  courseName: string,
  weekDay: number,
  begin: string,
  end: string
}

export interface IFullCalendarEvent {
  id?: string,
  title?: string,
  start?: string,
  end?: string,
  extendedProps?: IClassMeta
}

interface IClassMeta {
  courseId?: string,
  courseName?: string,
  weekDay?: number,
  begin?: string,
  end?: string
}