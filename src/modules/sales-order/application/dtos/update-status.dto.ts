import { SalesOrderStatus } from '@modules/sales-order/domain/entities/sales-order-status.enum';

export class UpdateStatusDto {
  status!: SalesOrderStatus;
}
