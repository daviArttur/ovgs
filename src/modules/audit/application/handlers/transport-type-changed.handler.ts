import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AbstractAuditRecordRepository } from '@modules/audit/domain/repositories/abstract-audit-record.repository';
import { AuditRecord } from '@modules/audit/domain/entities/audit-record.entity';
import { AuditActionType } from '@modules/audit/domain/entities/audit-action-type.enum';
import { TransportTypeChangedEvent } from '@modules/sales-order/domain/events/transport-type-changed.event';

@Injectable()
export class TransportTypeChangedHandler {
  constructor(private readonly auditRepo: AbstractAuditRecordRepository) {}

  @OnEvent('sales-order.transport-type-changed', { async: true })
  async handle(event: TransportTypeChangedEvent): Promise<void> {
    const record = AuditRecord.create({
      entityType: 'SalesOrder',
      entityId: event.orderId,
      actionType: AuditActionType.TRANSPORT_CHANGED,
      previousState: { transportTypeId: event.previousTransportTypeId },
      newState: { transportTypeId: event.newTransportTypeId },
      occurredAt: event.occurredAt,
    });
    await this.auditRepo.save(record);
  }
}
