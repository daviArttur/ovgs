import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AbstractAuditRecordRepository } from '@modules/audit/domain/repositories/abstract-audit-record.repository';
import { AuditRecord } from '@modules/audit/domain/entities/audit-record.entity';
import { AuditActionType } from '@modules/audit/domain/entities/audit-action-type.enum';
import { SalesOrderCreatedEvent } from '@modules/sales-order/domain/events/sales-order-created.event';

@Injectable()
export class SalesOrderCreatedHandler {
  constructor(private readonly auditRepo: AbstractAuditRecordRepository) {}

  @OnEvent('sales-order.created', { async: true })
  async handle(event: SalesOrderCreatedEvent): Promise<void> {
    const record = AuditRecord.create({
      entityType: 'SalesOrder',
      entityId: event.orderId,
      actionType: AuditActionType.ORDER_CREATED,
      previousState: null,
      newState: {
        orderNumber: event.orderNumber,
        customerId: event.customerId,
        transportTypeId: event.transportTypeId,
      },
      occurredAt: event.occurredAt,
    });
    await this.auditRepo.save(record);
  }
}
