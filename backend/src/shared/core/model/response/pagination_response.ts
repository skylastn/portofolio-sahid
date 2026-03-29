export class PaginationResponse<T> {
  constructor(
    public status: boolean,
    public message: string,
    public currentPage: number,
    public perPage: number,
    public total: number,
    public data: T[],
    public meta: { first: number; last: number },
  ) {}

  // map dari PaginationResponse<E> -> PaginationResponse<R>
  static map<E, R>(
    paginationEntity: PaginationResponse<E>,
    mapper: (item: E) => R,
  ): PaginationResponse<R> {
    return new PaginationResponse<R>(
      paginationEntity.status,
      paginationEntity.message,
      paginationEntity.currentPage,
      paginationEntity.perPage,
      paginationEntity.total,
      paginationEntity.data.map(mapper),
      paginationEntity.meta,
    );
  }
}
