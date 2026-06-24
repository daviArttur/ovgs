import { DomainEvent } from '@shared/domain/base/domain-event.base';
import { DeliveryWindow } from '../value-objects/delivery-window.vo';

export class DeliveryScheduledEvent extends DomainEvent {
  readonly eventType = 'sales-order.delivery-scheduled';

  constructor(
    readonly orderId: string,
    readonly deliveryWindow: DeliveryWindow,
  ) {
    super();
  }
}
