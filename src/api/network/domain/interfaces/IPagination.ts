export interface IPagination<T> {
  currentPage: number
  from: number
  items: T[]
  lastPage: number
  perPage: number
  to: number
  total: number
}
