import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class SalesOrderNotFoundException extends DomainException {
  readonly code = 'SALES_ORDER_NOT_FOUND';

  constructor(id: string) {
    super(`SalesOrder with id "${id}" not found`);
  }
}
