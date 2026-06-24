import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class TransportTypeNotAuthorizedException extends DomainException {
  readonly code = 'TRANSPORT_TYPE_NOT_AUTHORIZED';

  constructor(customerId: string, transportTypeId: string) {
    super(
      `TransportType "${transportTypeId}" is not authorized for customer "${customerId}"`,
    );
  }
}
