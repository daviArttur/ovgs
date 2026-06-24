import { DomainException } from '@shared/domain/exceptions/domain.exception';
import { SalesOrderStatus } from '../entities/sales-order-status.enum';

export class InvalidStatusTransitionException extends DomainException {
  readonly code = 'INVALID_STATUS_TRANSITION';

  constructor(from: SalesOrderStatus, to: SalesOrderStatus) {
    super(`Cannot transition SalesOrder from "${from}" to "${to}"`);
  }
}
