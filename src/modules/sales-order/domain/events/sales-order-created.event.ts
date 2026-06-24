import { DomainEvent } from '@shared/domain/base/domain-event.base';

export class SalesOrderCreatedEvent extends DomainEvent {
  readonly eventType = 'sales-order.created';

  constructor(
    readonly orderId: string,
    readonly orderNumber: string,
    readonly customerId: string,
    readonly transportTypeId: string,
  ) {
    super();
  }
}
