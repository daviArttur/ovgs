import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AbstractAuditRecordRepository } from '@modules/audit/domain/repositories/abstract-audit-record.repository';
import { AuditRecord } from '@modules/audit/domain/entities/audit-record.entity';
import { AuditActionType } from '@modules/audit/domain/entities/audit-action-type.enum';
import { SalesOrderStatusChangedEvent } from '@modules/sales-order/domain/events/sales-order-status-changed.event';

@Injectable()
export class SalesOrderStatusChangedHandler {
  constructor(private readonly auditRepo: AbstractAuditRecordRepository) {}

  @OnEvent('sales-order.status-changed', { async: true })
  async handle(event: SalesOrderStatusChangedEvent): Promise<void> {
    const record = AuditRecord.create({
      entityType: 'SalesOrder',
      entityId: event.orderId,
      actionType: AuditActionType.STATUS_CHANGED,
      previousState: { status: event.previousStatus },
      newState: { status: event.newStatus },
      occurredAt: event.occurredAt,
    });
    await this.auditRepo.save(record);
  }
}
