import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class requestPaginated {
  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({ default: 1 }) // Tambahkan default value
  @IsNotEmpty()
  page: number;

  @ApiProperty({ default: 10 })
  @IsNotEmpty()
  record: number;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({ required: false })
  @IsOptional()
  @IsString()
  order?: string;
}
