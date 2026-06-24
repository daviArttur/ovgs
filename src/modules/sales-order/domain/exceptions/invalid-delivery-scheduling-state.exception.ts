import { DomainException } from '@shared/domain/exceptions/domain.exception';
import { SalesOrderStatus } from '../entities/sales-order-status.enum';

export class InvalidDeliverySchedulingStateException extends DomainException {
  readonly code = 'INVALID_DELIVERY_SCHEDULING_STATE';

  constructor(currentStatus: SalesOrderStatus, requiredStatus: SalesOrderStatus) {
    super(
      `Cannot perform scheduling operation: order status is "${currentStatus}", expected "${requiredStatus}"`,
    );
  }
}
