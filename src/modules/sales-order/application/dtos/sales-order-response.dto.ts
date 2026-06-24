import { SalesOrder } from '@modules/sales-order/domain/entities/sales-order.entity';
import { SalesOrderStatus } from '@modules/sales-order/domain/entities/sales-order-status.enum';

export class SalesOrderResponseDto {
  id!: string;
  orderNumber!: string;
  status!: SalesOrderStatus;
  customerId!: string;
  transportTypeId!: string;
  createdAt!: Date;
  updatedAt!: Date;

  static fromEntity(order: SalesOrder): SalesOrderResponseDto {
    const dto = new SalesOrderResponseDto();
    dto.id = order.id;
    dto.orderNumber = order.orderNumber.value;
    dto.status = order.status;
    dto.customerId = order.customerId;
    dto.transportTypeId = order.transportTypeId;
    dto.createdAt = order.createdAt;
    dto.updatedAt = order.updatedAt;
    return dto;
  }
}

export class SalesOrderDetailResponseDto extends SalesOrderResponseDto {
  items!: { itemId: string; quantity: number }[];
  deliverySchedule!: {
    date: Date;
    startTime: string;
    endTime: string;
    confirmed: boolean;
  } | null;

  static fromEntity(order: SalesOrder): SalesOrderDetailResponseDto {
    const dto = new SalesOrderDetailResponseDto();
    dto.id = order.id;
    dto.orderNumber = order.orderNumber.value;
    dto.status = order.status;
    dto.customerId = order.customerId;
    dto.transportTypeId = order.transportTypeId;
    dto.createdAt = order.createdAt;
    dto.updatedAt = order.updatedAt;
    dto.items = order.items.map((i) => ({ itemId: i.itemId, quantity: i.quantity }));
    dto.deliverySchedule = order.deliverySchedule
      ? {
          date: order.deliverySchedule.deliveryWindow.date,
          startTime: order.deliverySchedule.deliveryWindow.startTime,
          endTime: order.deliverySchedule.deliveryWindow.endTime,
          confirmed: order.deliverySchedule.confirmed,
        }
      : null;
    return dto;
  }
}
