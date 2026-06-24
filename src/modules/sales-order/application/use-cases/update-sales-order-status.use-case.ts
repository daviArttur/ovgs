import { Injectable } from '@nestjs/common';
import { AbstractSalesOrderRepository } from '@modules/sales-order/domain/repositories/abstract-sales-order.repository';
import { EventBus } from '@shared/application/ports/event-bus.port';
import { SalesOrderNotFoundException } from '@modules/sales-order/domain/exceptions/sales-order-not-found.exception';
import { UpdateStatusDto } from '../dtos/update-status.dto';
import { SalesOrderResponseDto } from '../dtos/sales-order-response.dto';

@Injectable()
export class UpdateSalesOrderStatusUseCase {
  constructor(
    private readonly repo: AbstractSalesOrderRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(id: string, dto: UpdateStatusDto): Promise<SalesOrderResponseDto> {
    const order = await this.repo.findById(id);
    if (!order) throw new SalesOrderNotFoundException(id);

    order.changeStatus(dto.status);

    await this.repo.save(order);
    await this.eventBus.publish(order.getDomainEvents());
    order.clearDomainEvents();

    return SalesOrderResponseDto.fromEntity(order);
  }
}
