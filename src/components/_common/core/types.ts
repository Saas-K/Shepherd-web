export interface IPageResponse<T> {
  list: T[],
  currentPage: 1,
  pageSize: 10,
  totalItems: 0
}

export interface IPageFilter {
  page: 1,
  limit: 10
}