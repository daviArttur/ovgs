import { DomainEvent } from '@shared/domain/base/domain-event.base';

export class TransportTypeChangedEvent extends DomainEvent {
  readonly eventType = 'sales-order.transport-type-changed';

  constructor(
    readonly orderId: string,
    readonly previousTransportTypeId: string,
    readonly newTransportTypeId: string,
  ) {
    super();
  }
}
