type PaginationCursor = Record<string, any>;

export interface SearchRepository<T> {
  where?: Partial<T>;
  order?: { [P in keyof T]?: 'ASC' | 'DESC' };
  limit?: number;
  skip?: number;
  cursor?: PaginationCursor;
}

export interface PaginationResult<T> {
  page: number;
  pageSize: number;
  total: number;
  results: T[];
  cursor?: PaginationCursor;
}

export interface IRepository<T> {
  findOne(where: SearchRepository<T>): Promise<T | null>;

  find(options?: SearchRepository<T>): Promise<PaginationResult<T>>;

  findByKey(key: string | number): Promise<T | null>;

  create(entity: T): Promise<T>;

  update(entity: T): Promise<T>;

  delete(where: Partial<T>, force?: boolean): Promise<number>;
}
