import { AuditRecord as PrismaAuditRecord } from '@prisma/client';
import { AuditRecord } from '@modules/audit/domain/entities/audit-record.entity';
import { AuditActionType } from '@modules/audit/domain/entities/audit-action-type.enum';

export class PrismaAuditRecordMapper {
  static toDomain(raw: PrismaAuditRecord): AuditRecord {
    return AuditRecord.reconstitute(
      raw.id,
      {
        entityType: raw.entityType,
        entityId: raw.entityId,
        actionType: raw.actionType as AuditActionType,
        previousState: raw.previousState,
        newState: raw.newState,
        occurredAt: raw.occurredAt,
      },
      raw.createdAt,
      raw.updatedAt,
    );
  }
}
