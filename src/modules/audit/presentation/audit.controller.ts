import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsString } from 'class-validator';
import { ListAuditRecordsUseCase } from '../application/use-cases/list-audit-records.use-case';
import { AuditRecordResponseDto } from '../application/dtos/audit-record-response.dto';
import { AuditActionType } from '../domain/entities/audit-action-type.enum';

class AuditFiltersRequestDto {
  @IsOptional()
  @IsString()
  entityType?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsEnum(AuditActionType)
  actionType?: AuditActionType;
}

@ApiTags('audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly listUseCase: ListAuditRecordsUseCase) {}

  @Get()
  @ApiOperation({ summary: 'List audit records with optional filters' })
  @ApiResponse({ status: 200, type: [AuditRecordResponseDto] })
  @ApiQuery({ name: 'entityType', required: false })
  @ApiQuery({ name: 'entityId', required: false })
  @ApiQuery({ name: 'actionType', enum: AuditActionType, required: false })
  findAll(@Query() filters: AuditFiltersRequestDto): Promise<AuditRecordResponseDto[]> {
    return this.listUseCase.execute(filters);
  }
}
