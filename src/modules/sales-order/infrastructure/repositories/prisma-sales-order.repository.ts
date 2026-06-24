import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import {
  AbstractSalesOrderRepository,
  SalesOrderFilters,
} from '@modules/sales-order/domain/repositories/abstract-sales-order.repository';
import { SalesOrder } from '@modules/sales-order/domain/entities/sales-order.entity';
import { PrismaSalesOrderMapper } from '../mappers/prisma-sales-order.mapper';

const INCLUDE_RELATIONS = {
  items: true,
  deliverySchedule: true,
} as const;

@Injectable()
export class PrismaSalesOrderRepository extends AbstractSalesOrderRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: string): Promise<SalesOrder | null> {
    const raw = await this.prisma.salesOrder.findUnique({
      where: { id },
      include: INCLUDE_RELATIONS,
    });
    return raw ? PrismaSalesOrderMapper.toDomain(raw) : null;
  }

  async findAll(filters?: SalesOrderFilters): Promise<SalesOrder[]> {
    const where: Prisma.SalesOrderWhereInput = {};
    if (filters?.status) where.status = PrismaSalesOrderMapper.statusToPrisma(filters.status);
    if (filters?.customerId) where.customerId = filters.customerId;
    if (filters?.transportTypeId) where.transportTypeId = filters.transportTypeId;
    if (filters?.date) {
      const start = new Date(filters.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(filters.date);
      end.setHours(23, 59, 59, 999);
      where.deliverySchedule = { date: { gte: start, lte: end } };
    }

    const raws = await this.prisma.salesOrder.findMany({
      where,
      include: INCLUDE_RELATIONS,
      orderBy: { createdAt: 'desc' },
    });
    return raws.map(PrismaSalesOrderMapper.toDomain);
  }

  async save(order: SalesOrder): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.salesOrder.upsert({
        where: { id: order.id },
        create: {
          id: order.id,
          orderNumber: order.orderNumber.value,
          status: PrismaSalesOrderMapper.statusToPrisma(order.status),
          customerId: order.customerId,
          transportTypeId: order.transportTypeId,
        },
        update: {
          status: PrismaSalesOrderMapper.statusToPrisma(order.status),
          transportTypeId: order.transportTypeId,
        },
      });

      await tx.orderItem.deleteMany({ where: { salesOrderId: order.id } });
      await tx.orderItem.createMany({
        data: order.items.map((i) => ({
          id: i.id,
          salesOrderId: order.id,
          itemId: i.itemId,
          quantity: i.quantity,
        })),
      });

      if (order.deliverySchedule) {
        const ds = order.deliverySchedule;
        await tx.deliverySchedule.upsert({
          where: { salesOrderId: order.id },
          create: {
            id: ds.id,
            salesOrderId: order.id,
            date: ds.deliveryWindow.date,
            startTime: ds.deliveryWindow.startTime,
            endTime: ds.deliveryWindow.endTime,
            confirmed: ds.confirmed,
          },
          update: {
            date: ds.deliveryWindow.date,
            startTime: ds.deliveryWindow.startTime,
            endTime: ds.deliveryWindow.endTime,
            confirmed: ds.confirmed,
          },
        });
      }
    });
  }
}
