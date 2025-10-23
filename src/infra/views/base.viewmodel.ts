import { PaginationResult } from 'src/domain/repository/repository.interface';

abstract class ViewModel {
  private data: Record<string, any>;

  constructor(data: Record<string, any>) {
    this.data = data;
  }

  static createOne<T extends Record<string, any>, U extends ViewModel>(
    clase: new (data: T) => U,
    data: T,
    parseToPlainObject: boolean = true,
  ): U | Record<string, any> {
    const item = new clase(data);

    if (parseToPlainObject) {
      return item.toJSON();
    }

    return item;
  }

  static createMany<T extends Record<string, any>, U extends ViewModel>(
    clase: new (data: T) => U,
    data: T[] | Record<string, any>,
    parseToPlainObject: boolean = true,
  ): U[] {
    const items = data.map((item: T) => new clase(item));

    if (parseToPlainObject) {
      return items.map((item: { toJSON: () => any }) => item.toJSON());
    }

    return items;
  }

  static createPage<T extends Record<string, any>, U extends ViewModel>(
    clase: new (data: T) => U,
    paginatedData: PaginationResult<T>,
  ): PaginationResult<any> {
    return {
      results: paginatedData.results.map((item: T) =>
        ViewModel.createOne(clase, item),
      ),
      pageSize: paginatedData.pageSize,
      total: paginatedData.total,
      page: paginatedData.page,
    };
  }

  public toJSON(): Record<string, any> {
    return this.data;
  }
}

export default ViewModel;
