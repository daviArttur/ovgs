import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AbstractAuditRecordRepository } from '@modules/audit/domain/repositories/abstract-audit-record.repository';
import { AuditRecord } from '@modules/audit/domain/entities/audit-record.entity';
import { AuditActionType } from '@modules/audit/domain/entities/audit-action-type.enum';
import { DeliveryConfirmedEvent } from '@modules/sales-order/domain/events/delivery-confirmed.event';

@Injectable()
export class DeliveryConfirmedHandler {
  constructor(private readonly auditRepo: AbstractAuditRecordRepository) {}

  @OnEvent('sales-order.delivery-confirmed', { async: true })
  async handle(event: DeliveryConfirmedEvent): Promise<void> {
    const record = AuditRecord.create({
      entityType: 'SalesOrder',
      entityId: event.orderId,
      actionType: AuditActionType.DELIVERY_CONFIRMED,
      previousState: null,
      newState: { confirmed: true },
      occurredAt: event.occurredAt,
    });
    await this.auditRepo.save(record);
  }
}
