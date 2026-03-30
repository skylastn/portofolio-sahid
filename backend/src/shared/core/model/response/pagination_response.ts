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
  static async map<E, R>(
    paginationEntity: PaginationResponse<E>,
    mapper: (item: E) => Promise<R>,
  ): Promise<PaginationResponse<R>> {
    return await Promise.all(
      paginationEntity.data.map(async (item: E) => await mapper(item)),
    ).then((mappedData: R[]) => {
      return new PaginationResponse<R>(
        paginationEntity.status,
        paginationEntity.message,
        paginationEntity.currentPage,
        paginationEntity.perPage,
        paginationEntity.total,
        mappedData,
        paginationEntity.meta,
      );
    });
  }
}
