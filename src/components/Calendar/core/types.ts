export interface IDayClassInfo {
  id?: string,
  courseId?: string,
  courseName?: string,
  weekDay?: number,
  begin?: string,
  end?: string,
  mainDayClassId?: string,
  mainDayClassDate?: string,
  date?: string,
  active?: boolean,
  color?: string
}

export interface IMainDay {
  id?: string,
  courseId?: string,
  courseName?: string,
  weekDay?: number,
  begin?: string,
  end?: string,
  active?: true,
  color?: string
}

export interface IFullCalendarEvent {
  id?: string,
  title?: string,
  start?: string,
  end?: string,
  textColor?: 'white',
  backgroundColor?: string,
  extendedProps?: IClassMeta
}

export interface IClassMeta {
  courseId?: string,
  courseName?: string,
  weekDay?: number,
  begin?: string,
  end?: string
  mainDayClassId?: string,
  mainDayClassDate?: string,
  date?: string,
  active?: boolean,
  color?: string
}

export interface IClassSlot {
  id?: string,
  courseId?: string,
  weekDay?: number,
  start?: Date,
  end?: Date,
  startStr: string,
  endStr: string
}

export interface IToggleCancelClass {
  mainDayClassId?: string,
  mainDayClassDate?: string | null | undefined,
  altDayClassId?: string | null,
  canceled?: boolean
}