import { ICourse } from "../../Course/core/types"
import { IStudent } from "../../Student/core/types"
import { IPageFilter } from "../../_common/core/types"

export interface IEnrollment {
  id?: string,
  course: ICourse,
  student: IStudent,
  date: string,
  startDate?: string,
  active?: true,
  sendNotification?: true
}

export interface IEnrollmentFilter extends IPageFilter {
  studentName?: string,
  courseName?: string,
  dateFrom?: string,
  dateTo?: string,
  active?: boolean,
  sendNotification?: boolean
}