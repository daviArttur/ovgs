import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AbstractAuditRecordRepository } from '@modules/audit/domain/repositories/abstract-audit-record.repository';
import { AuditRecord } from '@modules/audit/domain/entities/audit-record.entity';
import { AuditActionType } from '@modules/audit/domain/entities/audit-action-type.enum';
import { DeliveryScheduledEvent } from '@modules/sales-order/domain/events/delivery-scheduled.event';

@Injectable()
export class DeliveryScheduledHandler {
  constructor(private readonly auditRepo: AbstractAuditRecordRepository) {}

  @OnEvent('sales-order.delivery-scheduled', { async: true })
  async handle(event: DeliveryScheduledEvent): Promise<void> {
    const record = AuditRecord.create({
      entityType: 'SalesOrder',
      entityId: event.orderId,
      actionType: AuditActionType.DELIVERY_SCHEDULED,
      previousState: null,
      newState: {
        date: event.deliveryWindow.date,
        startTime: event.deliveryWindow.startTime,
        endTime: event.deliveryWindow.endTime,
      },
      occurredAt: event.occurredAt,
    });
    await this.auditRepo.save(record);
  }
}
