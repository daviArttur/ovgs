import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';
import { CreateTransportTypeUseCase } from '../application/use-cases/create-transport-type.use-case';
import { UpdateTransportTypeUseCase } from '../application/use-cases/update-transport-type.use-case';
import { GetTransportTypeUseCase } from '../application/use-cases/get-transport-type.use-case';
import { ListTransportTypesUseCase } from '../application/use-cases/list-transport-types.use-case';
import { TransportTypeResponseDto } from '../application/dtos/transport-type-response.dto';

class CreateTransportTypeRequestDto {
  @ApiProperty({ example: 'Road Freight' })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiProperty({ example: 'Standard road transport for large volumes', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

class UpdateTransportTypeRequestDto {
  @ApiProperty({ example: 'Air Freight', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiProperty({ example: 'Express air delivery', required: false, nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;
}

@ApiTags('transport-types')
@Controller('transport-types')
export class TransportTypeController {
  constructor(
    private readonly createUseCase: CreateTransportTypeUseCase,
    private readonly updateUseCase: UpdateTransportTypeUseCase,
    private readonly getUseCase: GetTransportTypeUseCase,
    private readonly listUseCase: ListTransportTypesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a transport type' })
  @ApiResponse({ status: 201, type: TransportTypeResponseDto })
  create(@Body() dto: CreateTransportTypeRequestDto): Promise<TransportTypeResponseDto> {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all transport types' })
  @ApiResponse({ status: 200, type: [TransportTypeResponseDto] })
  findAll(): Promise<TransportTypeResponseDto[]> {
    return this.listUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transport type by id' })
  @ApiResponse({ status: 200, type: TransportTypeResponseDto })
  findOne(@Param('id') id: string): Promise<TransportTypeResponseDto> {
    return this.getUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a transport type' })
  @ApiResponse({ status: 200, type: TransportTypeResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTransportTypeRequestDto,
  ): Promise<TransportTypeResponseDto> {
    return this.updateUseCase.execute(id, dto);
  }
}
