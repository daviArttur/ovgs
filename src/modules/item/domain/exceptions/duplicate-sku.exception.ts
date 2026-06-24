import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class DuplicateSkuException extends DomainException {
  readonly code = 'DUPLICATE_SKU';

  constructor(sku: string) {
    super(`Item with SKU "${sku}" already exists`);
  }
}
