export interface IPageResponse<T> {
  list: T[],
  currentPage: number,
  pageSize: number,
  totalItems: number
}

export interface ICourse {
  id: string,
  name: string,
  startDate: string,
  active: true,
  pricePerClass: number,
  classPerWeek: number,
  description: string
}