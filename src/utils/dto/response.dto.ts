interface PaginationMeta {
  totalRow: number;
  totalPage: number;
  start: number;
  end: number;
  currentPage: number;
  prePage: number;
}

class PaginatedDto<TData> {
  status: string;
  message: string;
  datas: TData[];
  meta?: PaginationMeta;
}

export { PaginatedDto, PaginationMeta };
