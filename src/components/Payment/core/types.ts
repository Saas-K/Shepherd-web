import { IPageFilter } from "../../_common/core/types"

export interface IPayment {
  id?: string,
  enrollmentId: string,
  sendNotification: boolean,
  courseId: string,
  courseName: string,
  studentId: string,
  studentName: string,
  price: number,
  date: string,
  unpaid: number,
  paidDate?: string
}

export interface IPaymentFilter extends IPageFilter {
  courseName?: string,
  studentName?: string,
  dateFrom?: string,
  dateTo?: string,
  paidDateFrom?: string,
  paidDateTo?: string,
  paid?: boolean
}