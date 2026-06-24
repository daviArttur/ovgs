import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  IsDateString,
  IsUUID,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SalesOrderStatus } from '../domain/entities/sales-order-status.enum';
import { CreateSalesOrderUseCase } from '../application/use-cases/create-sales-order.use-case';
import { GetSalesOrderUseCase } from '../application/use-cases/get-sales-order.use-case';
import { ListSalesOrdersUseCase } from '../application/use-cases/list-sales-orders.use-case';
import { UpdateSalesOrderStatusUseCase } from '../application/use-cases/update-sales-order-status.use-case';
import { ScheduleDeliveryUseCase } from '../application/use-cases/schedule-delivery.use-case';
import { RescheduleDeliveryUseCase } from '../application/use-cases/reschedule-delivery.use-case';
import { ConfirmDeliveryScheduleUseCase } from '../application/use-cases/confirm-delivery-schedule.use-case';
import {
  SalesOrderResponseDto,
  SalesOrderDetailResponseDto,
} from '../application/dtos/sales-order-response.dto';
class SalesOrderFiltersRequestDto {
  @IsOptional()
  @IsEnum(SalesOrderStatus)
  status?: SalesOrderStatus;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  transportTypeId?: string;

  @IsOptional()
  @IsString()
  date?: string;
}

class OrderItemRequestDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID('4')
  itemId!: string;

  @ApiProperty({ example: 10 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  quantity!: number;
}

class CreateSalesOrderRequestDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID('4')
  customerId!: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  @IsUUID('4')
  transportTypeId!: string;

  @ApiProperty({ type: [OrderItemRequestDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemRequestDto)
  items!: OrderItemRequestDto[];
}

class UpdateStatusRequestDto {
  @ApiProperty({ enum: SalesOrderStatus, example: SalesOrderStatus.PLANEJADA })
  @IsEnum(SalesOrderStatus)
  status!: SalesOrderStatus;
}

class ScheduleDeliveryRequestDto {
  @ApiProperty({ example: '2025-12-15' })
  @IsDateString()
  date!: string;

  @ApiProperty({ example: '09:00' })
  @Matches(/^\d{2}:\d{2}$/)
  startTime!: string;

  @ApiProperty({ example: '17:00' })
  @Matches(/^\d{2}:\d{2}$/)
  endTime!: string;
}

@ApiTags('orders')
@Controller('orders')
export class SalesOrderController {
  constructor(
    private readonly createUseCase: CreateSalesOrderUseCase,
    private readonly getUseCase: GetSalesOrderUseCase,
    private readonly listUseCase: ListSalesOrdersUseCase,
    private readonly updateStatusUseCase: UpdateSalesOrderStatusUseCase,
    private readonly scheduleUseCase: ScheduleDeliveryUseCase,
    private readonly rescheduleUseCase: RescheduleDeliveryUseCase,
    private readonly confirmUseCase: ConfirmDeliveryScheduleUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a sales order' })
  @ApiResponse({ status: 201, type: SalesOrderDetailResponseDto })
  create(@Body() dto: CreateSalesOrderRequestDto): Promise<SalesOrderDetailResponseDto> {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List sales orders with optional filters' })
  @ApiResponse({ status: 200, type: [SalesOrderResponseDto] })
  @ApiQuery({ name: 'status', enum: SalesOrderStatus, required: false })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'transportTypeId', required: false })
  @ApiQuery({ name: 'date', required: false })
  findAll(@Query() filters: SalesOrderFiltersRequestDto): Promise<SalesOrderResponseDto[]> {
    return this.listUseCase.execute(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sales order by id' })
  @ApiResponse({ status: 200, type: SalesOrderDetailResponseDto })
  findOne(@Param('id') id: string): Promise<SalesOrderDetailResponseDto> {
    return this.getUseCase.execute(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update sales order status' })
  @ApiResponse({ status: 200, type: SalesOrderResponseDto })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusRequestDto,
  ): Promise<SalesOrderResponseDto> {
    return this.updateStatusUseCase.execute(id, dto);
  }

  @Post(':id/schedule')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Schedule delivery for a sales order' })
  @ApiResponse({ status: 200, type: SalesOrderDetailResponseDto })
  scheduleDelivery(
    @Param('id') id: string,
    @Body() dto: ScheduleDeliveryRequestDto,
  ): Promise<SalesOrderDetailResponseDto> {
    return this.scheduleUseCase.execute(id, dto);
  }

  @Patch(':id/schedule')
  @ApiOperation({ summary: 'Reschedule delivery for a sales order' })
  @ApiResponse({ status: 200, type: SalesOrderDetailResponseDto })
  rescheduleDelivery(
    @Param('id') id: string,
    @Body() dto: ScheduleDeliveryRequestDto,
  ): Promise<SalesOrderDetailResponseDto> {
    return this.rescheduleUseCase.execute(id, dto);
  }

  @Post(':id/schedule/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirm delivery schedule' })
  @ApiResponse({ status: 200, type: SalesOrderDetailResponseDto })
  confirmDelivery(@Param('id') id: string): Promise<SalesOrderDetailResponseDto> {
    return this.confirmUseCase.execute(id);
  }
}
