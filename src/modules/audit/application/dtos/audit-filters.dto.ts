import { AuditActionType } from '@modules/audit/domain/entities/audit-action-type.enum';

export class AuditFiltersDto {
  entityType?: string;
  entityId?: string;
  actionType?: AuditActionType;
}
