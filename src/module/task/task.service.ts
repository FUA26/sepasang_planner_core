import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto, id: number) {
    return this.prisma.task.create({
      data: {
        creatorId: id,
        ...createTaskDto,
      },
    });
  }

  async findAll(paginationQuery, queryParams, id): Promise<any> {
    const count = await this.prisma.task.count();
    const sort = queryParams.sort || 'createdAt'; // Default 'date_created' jika queryParams.sort tidak ada
    const order = queryParams.order || 'desc'; // De
    const datas = await this.prisma.task.findMany({
      orderBy: {
        [sort]: order,
      },
      where: {
        creatorId: id,
      },
      take: paginationQuery.end,
      skip: paginationQuery.start,
    });
    return { count, datas };
  }

  findOne(id: string, sub) {
    return this.prisma.task.findFirst({
      where: {
        id: id,
        creatorId: sub,
      },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, sub) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      throw new Error(`Task with ID ${id} not found.`);
    }

    if (task.creatorId !== sub) {
      throw new Error(`You are not authorized to delete this task.`);
    }
    return await this.prisma.task.update({
      where: {
        id: id,
      },
      data: {
        ...updateTaskDto,
      },
    });
  }

  async remove(id: string, sub) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      throw new Error(`Task with ID ${id} not found.`);
    }

    if (task.creatorId !== sub) {
      throw new Error(`You are not authorized to delete this task.`);
    }

    return this.prisma.task.delete({
      where: { id: id },
    });
  }
}
