import { SalesOrder } from '../entities/sales-order.entity';
import { SalesOrderStatus } from '../entities/sales-order-status.enum';

export interface SalesOrderFilters {
  status?: SalesOrderStatus;
  customerId?: string;
  transportTypeId?: string;
  date?: Date;
}

export abstract class AbstractSalesOrderRepository {
  abstract findById(id: string): Promise<SalesOrder | null>;
  abstract findAll(filters?: SalesOrderFilters): Promise<SalesOrder[]>;
  abstract save(order: SalesOrder): Promise<void>;
}
