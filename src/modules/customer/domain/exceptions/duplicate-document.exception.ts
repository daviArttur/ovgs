import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class DuplicateDocumentException extends DomainException {
  readonly code = 'DUPLICATE_DOCUMENT';

  constructor(document: string) {
    super(`Customer with document "${document}" already exists`);
  }
}
