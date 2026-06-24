import { DomainEvent } from '@shared/domain/base/domain-event.base';
import { SalesOrderStatus } from '../entities/sales-order-status.enum';

export class SalesOrderStatusChangedEvent extends DomainEvent {
  readonly eventType = 'sales-order.status-changed';

  constructor(
    readonly orderId: string,
    readonly previousStatus: SalesOrderStatus,
    readonly newStatus: SalesOrderStatus,
  ) {
    super();
  }
}
