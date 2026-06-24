import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class DuplicateTransportTypeNameException extends DomainException {
  readonly code = 'DUPLICATE_TRANSPORT_TYPE_NAME';

  constructor(name: string) {
    super(`TransportType with name "${name}" already exists`);
  }
}
