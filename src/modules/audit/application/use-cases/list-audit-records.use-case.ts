import { Injectable } from '@nestjs/common';
import { AbstractAuditRecordRepository } from '@modules/audit/domain/repositories/abstract-audit-record.repository';
import { AuditFiltersDto } from '../dtos/audit-filters.dto';
import { AuditRecordResponseDto } from '../dtos/audit-record-response.dto';

@Injectable()
export class ListAuditRecordsUseCase {
  constructor(private readonly auditRepo: AbstractAuditRecordRepository) {}

  async execute(filters?: AuditFiltersDto): Promise<AuditRecordResponseDto[]> {
    const records = await this.auditRepo.findAll(filters);
    return records.map(AuditRecordResponseDto.fromEntity);
  }
}
