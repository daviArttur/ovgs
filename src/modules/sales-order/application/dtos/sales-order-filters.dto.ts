import { SalesOrderStatus } from '@modules/sales-order/domain/entities/sales-order-status.enum';

export class SalesOrderFiltersDto {
  status?: SalesOrderStatus;
  customerId?: string;
  transportTypeId?: string;
  date?: string;
}
