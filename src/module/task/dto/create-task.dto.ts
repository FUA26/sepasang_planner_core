import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    description: 'title',
    default: 'Task 1',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'description',
    default: 'discripsi singkat',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'status',
    default: 1,
  })
  @IsNotEmpty()
  status: number;

  @ApiProperty({
    description: 'category',
    default: 30,
  })
  @IsNotEmpty()
  categoryId: number;
}
