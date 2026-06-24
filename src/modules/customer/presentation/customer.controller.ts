import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength, IsArray, IsUUID } from 'class-validator';
import { CreateCustomerUseCase } from '../application/use-cases/create-customer.use-case';
import { GetCustomerUseCase } from '../application/use-cases/get-customer.use-case';
import { ListCustomersUseCase } from '../application/use-cases/list-customers.use-case';
import { UpdateCustomerUseCase } from '../application/use-cases/update-customer.use-case';
import { AuthorizeTransportTypeUseCase } from '../application/use-cases/authorize-transport-type.use-case';
import { CustomerResponseDto } from '../application/dtos/customer-response.dto';

class CreateCustomerRequestDto {
  @ApiProperty({ example: 'Acme Corporation' })
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiProperty({ example: '12.345.678/0001-99' })
  @IsString()
  @MinLength(1)
  document!: string;
}

class UpdateCustomerRequestDto {
  @ApiProperty({ example: 'Acme Corp Ltda', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @ApiProperty({ example: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'], required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  authorizedTransportTypeIds?: string[];
}

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createUseCase: CreateCustomerUseCase,
    private readonly getUseCase: GetCustomerUseCase,
    private readonly listUseCase: ListCustomersUseCase,
    private readonly updateUseCase: UpdateCustomerUseCase,
    private readonly authorizeUseCase: AuthorizeTransportTypeUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a customer' })
  @ApiResponse({ status: 201, type: CustomerResponseDto })
  create(@Body() dto: CreateCustomerRequestDto): Promise<CustomerResponseDto> {
    return this.createUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all customers' })
  @ApiResponse({ status: 200, type: [CustomerResponseDto] })
  findAll(): Promise<CustomerResponseDto[]> {
    return this.listUseCase.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by id' })
  @ApiResponse({ status: 200, type: CustomerResponseDto })
  findOne(@Param('id') id: string): Promise<CustomerResponseDto> {
    return this.getUseCase.execute(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({ status: 200, type: CustomerResponseDto })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    return this.updateUseCase.execute(id, dto);
  }

  @Post(':id/transport-types/:transportTypeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authorize a transport type for a customer' })
  @ApiResponse({ status: 200, type: CustomerResponseDto })
  authorizeTransportType(
    @Param('id') customerId: string,
    @Param('transportTypeId') transportTypeId: string,
  ): Promise<CustomerResponseDto> {
    return this.authorizeUseCase.execute(customerId, transportTypeId);
  }
}
