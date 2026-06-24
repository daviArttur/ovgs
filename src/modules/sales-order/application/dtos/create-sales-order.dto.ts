import { OrderItemDto } from './order-item.dto';

export class CreateSalesOrderDto {
  customerId!: string;
  transportTypeId!: string;
  items!: OrderItemDto[];
}
