import { PaginationMeta } from 'src/utils/dto/response.dto';

export const StartEndHelper = (limit, page) => {
  if (!limit || !page) {
    throw new Error('Input error: Missing limit or page');
  }
  const start = 0 + (page - 1) * limit;
  const end = parseInt(limit);
  return { start, end };
};

export const NextPrevHelper = (total: number, limit: number, page: number) => {
  const start = 0 + (page - 1) * limit;
  const end = page * limit;
  const pagination: PaginationMeta = {
    totalRow: total,
    totalPage: Math.ceil(total / limit),
    start,
    end,
    currentPage: page,
    prePage: limit,
  };
  return pagination;
};
