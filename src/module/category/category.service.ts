import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async findAll(paginationQuery, queryParams): Promise<any> {
    const count = await this.prisma.category.count();

    const datas = await this.prisma.category.findMany({
      orderBy: {
        [queryParams.sort]: queryParams.order,
      },

      take: paginationQuery.end,
      skip: paginationQuery.start,
    });
    return { count, datas };
  }

  async allList(): Promise<any> {
    return await this.prisma.category.findMany();
  }
}
