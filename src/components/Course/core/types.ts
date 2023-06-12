import { IPageFilter } from "../../_common/core/types"

export interface ICourse {
  id?: string,
  name: string,
  startDate: string,
  active?: true,
  pricePerClass: number,
  classPerWeek: number,
  description?: string,
  color: string,
  classScheduled?: number
}

export interface ICourseFilter extends IPageFilter {
  name?: string,
  startDateFrom?: string,
  startDateTo?: string,
  description?: string
}

export interface IColor {
  id: string,
  value: string,
  usedBy?: string;
}