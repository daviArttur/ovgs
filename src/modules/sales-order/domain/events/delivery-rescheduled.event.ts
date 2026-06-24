import { DomainEvent } from '@shared/domain/base/domain-event.base';
import { DeliveryWindow } from '../value-objects/delivery-window.vo';

export class DeliveryRescheduledEvent extends DomainEvent {
  readonly eventType = 'sales-order.delivery-rescheduled';

  constructor(
    readonly orderId: string,
    readonly previousWindow: DeliveryWindow,
    readonly newWindow: DeliveryWindow,
  ) {
    super();
  }
}
