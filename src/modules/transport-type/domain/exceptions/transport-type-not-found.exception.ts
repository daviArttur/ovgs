import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class TransportTypeNotFoundException extends DomainException {
  readonly code = 'TRANSPORT_TYPE_NOT_FOUND';

  constructor(id: string) {
    super(`TransportType with id "${id}" not found`);
  }
}
