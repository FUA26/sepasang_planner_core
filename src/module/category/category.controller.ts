import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Category } from '@prisma/client';
import { requestPaginated } from 'src/utils/dto/requestPaginated.dto';
import { PaginatedDto, PaginationMeta } from 'src/utils/dto/response.dto';
import {
  NextPrevHelper,
  StartEndHelper,
} from 'src/utils/helper/pagination.helper';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('list')
  async findAllList() {
    const data = await this.categoryService.allList();
    const response: PaginatedDto<Category> = {
      status: 'success',
      message: 'Data retrieved successfully',
      datas: data,
    };
    return response;
  }

  @Get()
  @ApiResponse({ status: 200, description: 'OK' })
  async findAll(@Query() query: requestPaginated) {
    const paginationQuery = StartEndHelper(query.record, query.page);
    const service = await this.categoryService.findAll(paginationQuery, query);
    const meta: PaginationMeta = await NextPrevHelper(
      service.count,
      query.record,
      query.page,
    );
    const data = service.datas;
    const response: PaginatedDto<Category> = {
      status: 'success',
      message: 'Data retrieved successfully',
      datas: data,
      meta,
    };

    return response;
  }
}
