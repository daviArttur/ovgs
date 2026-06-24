import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '@shared/domain/base/base-entity.base';
import { AuditActionType } from './audit-action-type.enum';

interface AuditRecordProps {
  entityType: string;
  entityId: string;
  actionType: AuditActionType;
  previousState: unknown;
  newState: unknown;
  occurredAt: Date;
}

export class AuditRecord extends BaseEntity<string> {
  private _entityType: string;
  private _entityId: string;
  private _actionType: AuditActionType;
  private _previousState: unknown;
  private _newState: unknown;
  private _occurredAt: Date;

  private constructor(id: string, props: AuditRecordProps, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._entityType = props.entityType;
    this._entityId = props.entityId;
    this._actionType = props.actionType;
    this._previousState = props.previousState;
    this._newState = props.newState;
    this._occurredAt = props.occurredAt;
  }

  static create(props: AuditRecordProps): AuditRecord {
    return new AuditRecord(uuidv4(), props);
  }

  static reconstitute(id: string, props: AuditRecordProps, createdAt: Date, updatedAt: Date): AuditRecord {
    return new AuditRecord(id, props, createdAt, updatedAt);
  }

  get entityType(): string { return this._entityType; }
  get entityId(): string { return this._entityId; }
  get actionType(): AuditActionType { return this._actionType; }
  get previousState(): unknown { return this._previousState; }
  get newState(): unknown { return this._newState; }
  get occurredAt(): Date { return this._occurredAt; }
}
