import { AuditRecord } from '@modules/audit/domain/entities/audit-record.entity';
import { AuditActionType } from '@modules/audit/domain/entities/audit-action-type.enum';

export class AuditRecordResponseDto {
  id!: string;
  entityType!: string;
  entityId!: string;
  actionType!: AuditActionType;
  previousState!: unknown;
  newState!: unknown;
  occurredAt!: Date;

  static fromEntity(record: AuditRecord): AuditRecordResponseDto {
    const dto = new AuditRecordResponseDto();
    dto.id = record.id;
    dto.entityType = record.entityType;
    dto.entityId = record.entityId;
    dto.actionType = record.actionType;
    dto.previousState = record.previousState;
    dto.newState = record.newState;
    dto.occurredAt = record.occurredAt;
    return dto;
  }
}
