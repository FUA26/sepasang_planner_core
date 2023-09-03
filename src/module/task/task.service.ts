import { HttpCode, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { HttpStatus } from '@nestjs/common';

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
    const sort = queryParams.sort || 'createdAt'; // Default 'createdAt' jika queryParams.sort tidak ada
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

  async findOne(id: string, sub) {
    const data = await this.prisma.task.findUnique({
      where: {
        id: id,
        creatorId: sub,
      },
    });

    if (!data) {
      throw new HttpException(
        `Task with ID ${id} not found.`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return data;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, sub) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      throw new HttpException(
        `Task with ID ${id} not found.`,
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (task.creatorId !== sub) {
      throw new HttpException(
        `You are not authorized to delete this task.`,
        HttpStatus.UNAUTHORIZED,
      );
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
