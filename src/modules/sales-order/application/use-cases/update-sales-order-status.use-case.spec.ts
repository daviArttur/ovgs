import { UpdateSalesOrderStatusUseCase } from './update-sales-order-status.use-case';
import { AbstractSalesOrderRepository } from '@modules/sales-order/domain/repositories/abstract-sales-order.repository';
import { EventBus } from '@shared/application/ports/event-bus.port';
import { SalesOrder } from '@modules/sales-order/domain/entities/sales-order.entity';
import { SalesOrderStatus } from '@modules/sales-order/domain/entities/sales-order-status.enum';
import { OrderItem } from '@modules/sales-order/domain/entities/order-item.entity';
import { OrderNumber } from '@modules/sales-order/domain/value-objects/order-number.vo';
import { SalesOrderNotFoundException } from '@modules/sales-order/domain/exceptions/sales-order-not-found.exception';
import { InvalidStatusTransitionException } from '@modules/sales-order/domain/exceptions/invalid-status-transition.exception';

describe('UpdateSalesOrderStatusUseCase', () => {
  let useCase: UpdateSalesOrderStatusUseCase;
  let repo: jest.Mocked<AbstractSalesOrderRepository>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(() => {
    repo = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    } as jest.Mocked<AbstractSalesOrderRepository>;

    eventBus = {
      publish: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<EventBus>;

    useCase = new UpdateSalesOrderStatusUseCase(repo, eventBus);
  });

  function makeOrder(status: SalesOrderStatus = SalesOrderStatus.CRIADA): SalesOrder {
    return SalesOrder.reconstitute(
      'order-1',
      {
        orderNumber: OrderNumber.reconstitute('OV-20240101-00001'),
        status,
        customerId: 'c-1',
        transportTypeId: 'tt-1',
        items: [OrderItem.create('item-1', 1)],
        deliverySchedule: null,
      },
      new Date(),
      new Date(),
    );
  }

  it('transitions CRIADA to PLANEJADA and emits event', async () => {
    // Arrange
    const order = makeOrder(SalesOrderStatus.CRIADA);
    repo.findById.mockResolvedValue(order);
    repo.save.mockResolvedValue(undefined);

    // Act
    const result = await useCase.execute('order-1', { status: SalesOrderStatus.PLANEJADA });

    // Assert
    expect(result.status).toBe(SalesOrderStatus.PLANEJADA);
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ eventType: 'sales-order.status-changed' }),
      ]),
    );
  });

  it('throws SalesOrderNotFoundException when order not found', async () => {
    // Arrange
    repo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(
      useCase.execute('nonexistent', { status: SalesOrderStatus.PLANEJADA }),
    ).rejects.toThrow(SalesOrderNotFoundException);
  });

  it('throws InvalidStatusTransitionException on invalid transition', async () => {
    // Arrange
    const order = makeOrder(SalesOrderStatus.CRIADA);
    repo.findById.mockResolvedValue(order);

    // Act & Assert
    await expect(
      useCase.execute('order-1', { status: SalesOrderStatus.ENTREGUE }),
    ).rejects.toThrow(InvalidStatusTransitionException);
  });
});
