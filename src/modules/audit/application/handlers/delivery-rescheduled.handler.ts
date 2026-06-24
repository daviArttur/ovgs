import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AbstractAuditRecordRepository } from '@modules/audit/domain/repositories/abstract-audit-record.repository';
import { AuditRecord } from '@modules/audit/domain/entities/audit-record.entity';
import { AuditActionType } from '@modules/audit/domain/entities/audit-action-type.enum';
import { DeliveryRescheduledEvent } from '@modules/sales-order/domain/events/delivery-rescheduled.event';

@Injectable()
export class DeliveryRescheduledHandler {
  constructor(private readonly auditRepo: AbstractAuditRecordRepository) {}

  @OnEvent('sales-order.delivery-rescheduled', { async: true })
  async handle(event: DeliveryRescheduledEvent): Promise<void> {
    const record = AuditRecord.create({
      entityType: 'SalesOrder',
      entityId: event.orderId,
      actionType: AuditActionType.DELIVERY_RESCHEDULED,
      previousState: {
        date: event.previousWindow.date,
        startTime: event.previousWindow.startTime,
        endTime: event.previousWindow.endTime,
      },
      newState: {
        date: event.newWindow.date,
        startTime: event.newWindow.startTime,
        endTime: event.newWindow.endTime,
      },
      occurredAt: event.occurredAt,
    });
    await this.auditRepo.save(record);
  }
}
