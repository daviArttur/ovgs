import {
  SalesOrder as PrismaSalesOrder,
  OrderItem as PrismaOrderItem,
  DeliverySchedule as PrismaDeliverySchedule,
  SalesOrderStatus as PrismaStatus,
} from '@prisma/client';
import { SalesOrder } from '@modules/sales-order/domain/entities/sales-order.entity';
import { SalesOrderStatus } from '@modules/sales-order/domain/entities/sales-order-status.enum';
import { OrderItem } from '@modules/sales-order/domain/entities/order-item.entity';
import { DeliverySchedule } from '@modules/sales-order/domain/entities/delivery-schedule.entity';
import { OrderNumber } from '@modules/sales-order/domain/value-objects/order-number.vo';
import { DeliveryWindow } from '@modules/sales-order/domain/value-objects/delivery-window.vo';

type SalesOrderWithRelations = PrismaSalesOrder & {
  items: PrismaOrderItem[];
  deliverySchedule: PrismaDeliverySchedule | null;
};

export class PrismaSalesOrderMapper {
  static toDomain(raw: SalesOrderWithRelations): SalesOrder {
    const orderItems = raw.items.map((i) =>
      OrderItem.reconstitute(i.id, i.itemId, i.quantity, i.createdAt, i.updatedAt),
    );

    let deliverySchedule: DeliverySchedule | null = null;
    if (raw.deliverySchedule) {
      const ds = raw.deliverySchedule;
      const window = DeliveryWindow.reconstitute(ds.date, ds.startTime, ds.endTime);
      deliverySchedule = DeliverySchedule.reconstitute(
        ds.id,
        window,
        ds.confirmed,
        ds.createdAt,
        ds.updatedAt,
      );
    }

    return SalesOrder.reconstitute(
      raw.id,
      {
        orderNumber: OrderNumber.reconstitute(raw.orderNumber),
        status: raw.status as SalesOrderStatus,
        customerId: raw.customerId,
        transportTypeId: raw.transportTypeId,
        items: orderItems,
        deliverySchedule,
      },
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static statusToPrisma(status: SalesOrderStatus): PrismaStatus {
    return status as PrismaStatus;
  }
}
