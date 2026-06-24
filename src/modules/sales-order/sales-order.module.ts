import { Module } from '@nestjs/common';
import { CustomerModule } from '@modules/customer/customer.module';
import { TransportTypeModule } from '@modules/transport-type/transport-type.module';
import { ItemModule } from '@modules/item/item.module';
import { EventBus } from '@shared/application/ports/event-bus.port';
import { NestJsEventBus } from '@shared/infrastructure/event-bus/nestjs-event-bus.adapter';
import { AbstractSalesOrderRepository } from './domain/repositories/abstract-sales-order.repository';
import { PrismaSalesOrderRepository } from './infrastructure/repositories/prisma-sales-order.repository';
import { CreateSalesOrderUseCase } from './application/use-cases/create-sales-order.use-case';
import { GetSalesOrderUseCase } from './application/use-cases/get-sales-order.use-case';
import { ListSalesOrdersUseCase } from './application/use-cases/list-sales-orders.use-case';
import { UpdateSalesOrderStatusUseCase } from './application/use-cases/update-sales-order-status.use-case';
import { ScheduleDeliveryUseCase } from './application/use-cases/schedule-delivery.use-case';
import { RescheduleDeliveryUseCase } from './application/use-cases/reschedule-delivery.use-case';
import { ConfirmDeliveryScheduleUseCase } from './application/use-cases/confirm-delivery-schedule.use-case';
import { SalesOrderController } from './presentation/sales-order.controller';

@Module({
  imports: [CustomerModule, TransportTypeModule, ItemModule],
  controllers: [SalesOrderController],
  providers: [
    { provide: AbstractSalesOrderRepository, useClass: PrismaSalesOrderRepository },
    { provide: EventBus, useClass: NestJsEventBus },
    CreateSalesOrderUseCase,
    GetSalesOrderUseCase,
    ListSalesOrdersUseCase,
    UpdateSalesOrderStatusUseCase,
    ScheduleDeliveryUseCase,
    RescheduleDeliveryUseCase,
    ConfirmDeliveryScheduleUseCase,
  ],
  exports: [
    AbstractSalesOrderRepository,
    CreateSalesOrderUseCase,
    GetSalesOrderUseCase,
    ListSalesOrdersUseCase,
    UpdateSalesOrderStatusUseCase,
    ScheduleDeliveryUseCase,
    RescheduleDeliveryUseCase,
    ConfirmDeliveryScheduleUseCase,
  ],
})
export class SalesOrderModule {}
