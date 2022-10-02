import { IPageFilter } from "../../_common/core/types"

export interface IStudent {
  id?: string,
  name: string,
  mobile?: string,
  parentMobile?: string,
  note?: string,
  active?: true
}

export interface IStudentFilter extends IPageFilter {
  name?: string,
  mobile?: string,
  parentMobile?: string,
  active?: boolean
}