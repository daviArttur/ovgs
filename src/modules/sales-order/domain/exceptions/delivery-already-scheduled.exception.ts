import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class DeliveryAlreadyScheduledException extends DomainException {
  readonly code = 'DELIVERY_ALREADY_SCHEDULED';

  constructor() {
    super('Delivery is already scheduled for this order');
  }
}
