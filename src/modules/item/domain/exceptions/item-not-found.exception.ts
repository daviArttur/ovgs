import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class ItemNotFoundException extends DomainException {
  readonly code = 'ITEM_NOT_FOUND';

  constructor(id: string) {
    super(`Item with id "${id}" not found`);
  }
}
