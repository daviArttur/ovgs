import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class NoDeliveryScheduleException extends DomainException {
  readonly code = 'NO_DELIVERY_SCHEDULE';

  constructor() {
    super('No delivery schedule exists for this order');
  }
}
