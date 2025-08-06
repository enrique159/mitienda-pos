export type PageFilters = {
  search?: string
  page?: number
  limit?: number
  orderBy?: string
  sort?: 'asc' | 'desc' | ''
}

export type MetaPage = {
  totalItems: number
  totalPages: number
  page: number
  limit: number
  offset: number
  endOffset: number
}
