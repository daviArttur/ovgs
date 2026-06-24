import { Injectable } from '@nestjs/common';
import { AbstractSalesOrderRepository } from '@modules/sales-order/domain/repositories/abstract-sales-order.repository';
import { EventBus } from '@shared/application/ports/event-bus.port';
import { SalesOrderNotFoundException } from '@modules/sales-order/domain/exceptions/sales-order-not-found.exception';
import { SalesOrderDetailResponseDto } from '../dtos/sales-order-response.dto';

@Injectable()
export class ConfirmDeliveryScheduleUseCase {
  constructor(
    private readonly repo: AbstractSalesOrderRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(id: string): Promise<SalesOrderDetailResponseDto> {
    const order = await this.repo.findById(id);
    if (!order) throw new SalesOrderNotFoundException(id);

    order.confirmDeliverySchedule();

    await this.repo.save(order);
    await this.eventBus.publish(order.getDomainEvents());
    order.clearDomainEvents();

    return SalesOrderDetailResponseDto.fromEntity(order);
  }
}
