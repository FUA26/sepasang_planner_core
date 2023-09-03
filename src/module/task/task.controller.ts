import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { requestPaginated } from 'src/utils/dto/requestPaginated.dto';
import { NextPrevHelper, StartEndHelper } from 'src/helper/pagination.helper';
import { PaginatedDto, PaginationMeta } from 'src/utils/dto/response.dto';
import { Task } from '@prisma/client';
import { JwtAuthGuard } from 'src/utils/guard/jwt-auth.guard';
@Controller({
  path: 'task',
  version: '1',
})
@ApiTags('Task')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Req() req, @Body() createTaskDto: CreateTaskDto) {
    const user = req.user;
    return this.taskService.create(createTaskDto, user.sub);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'OK' })
  async findAll(@Req() req, @Query() query: requestPaginated) {
    const user = req.user;
    const paginationQuery = StartEndHelper(query.record, query.page);
    const service = await this.taskService.findAll(
      paginationQuery,
      query,
      user.sub,
    );
    const meta: PaginationMeta = await NextPrevHelper(
      service.count,
      query.record,
      query.page,
    );
    const data = service.datas;
    const response: PaginatedDto<Task> = {
      status: 'success',
      message: 'Data retrieved successfully',
      datas: data,
      meta,
    };

    return response;
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: string) {
    const user = req.user;

    return this.taskService.findOne(id, user.sub);
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const user = req.user;
    return await this.taskService.update(id, updateTaskDto, user.sub);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id') id: string) {
    const user = req.user;
    return this.taskService.remove(id, user.sub);
  }
}
