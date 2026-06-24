import { DomainEvent } from '@shared/domain/base/domain-event.base';

export class DeliveryConfirmedEvent extends DomainEvent {
  readonly eventType = 'sales-order.delivery-confirmed';

  constructor(readonly orderId: string) {
    super();
  }
}
