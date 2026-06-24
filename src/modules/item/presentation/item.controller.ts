import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';
import { CreateItemUseCase } from '../application/use-cases/create-item.use-case';
import { GetItemUseCase } from '../application/use-cases/get-item.use-case';
import { ListItemsUseCase } from '../application/use-cases/list-items.use-case';
import { ItemResponseDto } from '../application/dtos/item-response.dto';

class CreateItemRequestDto {
  @ApiProperty({ example: 'SKU-001' })
  @IsString()
  @MinLength(1)
  sku!: string;

  @ApiProperty({ example: 'Widget Pro 5000' })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiProperty({ example: 'High-performance industrial widget', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

@ApiTags('items')
@Controller('items')
export class ItemController {
  constructor(
    private readonly createUseCase: CreateItemUseCase,
    private readonly getUseCase: GetItemUseCase,
    private readonly listUseCase: ListItemsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an item' })
  @ApiResponse({ status: 201, type: ItemResponseDto })
  create(@Body() dto: CreateItemRequestDto): Promise<ItemResponseDto> {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all items' })
  @ApiResponse({ status: 200, type: [ItemResponseDto] })
  findAll(): Promise<ItemResponseDto[]> {
    return this.listUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an item by id' })
  @ApiResponse({ status: 200, type: ItemResponseDto })
  findOne(@Param('id') id: string): Promise<ItemResponseDto> {
    return this.getUseCase.execute(id);
  }
}
