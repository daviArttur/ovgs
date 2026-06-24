import { AuditRecord } from '../entities/audit-record.entity';
import { AuditActionType } from '../entities/audit-action-type.enum';

export interface AuditFilters {
  entityType?: string;
  entityId?: string;
  actionType?: AuditActionType;
}

export abstract class AbstractAuditRecordRepository {
  abstract findAll(filters?: AuditFilters): Promise<AuditRecord[]>;
  abstract save(record: AuditRecord): Promise<void>;
}
