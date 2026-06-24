import { Injectable } from '@nestjs/common';
import { AbstractCustomerRepository } from '@modules/customer/domain/repositories/abstract-customer.repository';
import { AbstractTransportTypeRepository } from '@modules/transport-type/domain/repositories/abstract-transport-type.repository';
import { AbstractItemRepository } from '@modules/item/domain/repositories/abstract-item.repository';
import { AbstractSalesOrderRepository } from '@modules/sales-order/domain/repositories/abstract-sales-order.repository';
import { EventBus } from '@shared/application/ports/event-bus.port';
import { CustomerNotFoundException } from '@modules/customer/domain/exceptions/customer-not-found.exception';
import { TransportTypeNotFoundException } from '@modules/transport-type/domain/exceptions/transport-type-not-found.exception';
import { TransportTypeNotAuthorizedException } from '@modules/sales-order/domain/exceptions/transport-type-not-authorized.exception';
import { ItemNotFoundException } from '@modules/item/domain/exceptions/item-not-found.exception';
import { SalesOrder } from '@modules/sales-order/domain/entities/sales-order.entity';
import { OrderItem } from '@modules/sales-order/domain/entities/order-item.entity';
import { OrderNumber } from '@modules/sales-order/domain/value-objects/order-number.vo';
import { CreateSalesOrderDto } from '../dtos/create-sales-order.dto';
import { SalesOrderDetailResponseDto } from '../dtos/sales-order-response.dto';

@Injectable()
export class CreateSalesOrderUseCase {
  constructor(
    private readonly customerRepo: AbstractCustomerRepository,
    private readonly transportTypeRepo: AbstractTransportTypeRepository,
    private readonly itemRepo: AbstractItemRepository,
    private readonly salesOrderRepo: AbstractSalesOrderRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(dto: CreateSalesOrderDto): Promise<SalesOrderDetailResponseDto> {
    const customer = await this.customerRepo.findById(dto.customerId);
    if (!customer) throw new CustomerNotFoundException(dto.customerId);

    const transportType = await this.transportTypeRepo.findById(dto.transportTypeId);
    if (!transportType) throw new TransportTypeNotFoundException(dto.transportTypeId);

    if (!customer.isTransportTypeAuthorized(dto.transportTypeId)) {
      throw new TransportTypeNotAuthorizedException(customer.id, dto.transportTypeId);
    }

    const itemIds = dto.items.map((i) => i.itemId);
    const foundItems = await this.itemRepo.findAllByIds(itemIds);
    const foundIds = new Set(foundItems.map((i) => i.id));
    const missingId = itemIds.find((id) => !foundIds.has(id));
    if (missingId) throw new ItemNotFoundException(missingId);

    const orderItems = dto.items.map((i) => OrderItem.create(i.itemId, i.quantity));
    const order = SalesOrder.create({
      orderNumber: OrderNumber.generate(),
      customerId: dto.customerId,
      transportTypeId: dto.transportTypeId,
      items: orderItems,
    });

    await this.salesOrderRepo.save(order);
    await this.eventBus.publish(order.getDomainEvents());
    order.clearDomainEvents();

    return SalesOrderDetailResponseDto.fromEntity(order);
  }
}
