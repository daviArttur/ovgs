import { ScheduleDeliveryUseCase } from './schedule-delivery.use-case';
import { AbstractSalesOrderRepository } from '@modules/sales-order/domain/repositories/abstract-sales-order.repository';
import { EventBus } from '@shared/application/ports/event-bus.port';
import { SalesOrder } from '@modules/sales-order/domain/entities/sales-order.entity';
import { SalesOrderStatus } from '@modules/sales-order/domain/entities/sales-order-status.enum';
import { OrderItem } from '@modules/sales-order/domain/entities/order-item.entity';
import { OrderNumber } from '@modules/sales-order/domain/value-objects/order-number.vo';
import { DeliveryWindow } from '@modules/sales-order/domain/value-objects/delivery-window.vo';
import { DeliverySchedule } from '@modules/sales-order/domain/entities/delivery-schedule.entity';
import { SalesOrderNotFoundException } from '@modules/sales-order/domain/exceptions/sales-order-not-found.exception';

describe('ScheduleDeliveryUseCase', () => {
  let useCase: ScheduleDeliveryUseCase;
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

    useCase = new ScheduleDeliveryUseCase(repo, eventBus);
  });

  function makeOrder(
    status: SalesOrderStatus = SalesOrderStatus.PLANEJADA,
    deliverySchedule: DeliverySchedule | null = null,
  ): SalesOrder {
    return SalesOrder.reconstitute(
      'order-1',
      {
        orderNumber: OrderNumber.reconstitute('OV-20240101-00001'),
        status,
        customerId: 'c-1',
        transportTypeId: 'tt-1',
        items: [OrderItem.create('item-1', 1)],
        deliverySchedule,
      },
      new Date(),
      new Date(),
    );
  }

  const dto = { date: '2025-01-15', startTime: '09:00', endTime: '12:00' };

  it('schedules delivery and emits event', async () => {
    // Arrange
    const order = makeOrder(SalesOrderStatus.PLANEJADA);
    repo.findById.mockResolvedValue(order);
    repo.save.mockResolvedValue(undefined);

    // Act
    const result = await useCase.execute('order-1', dto);

    // Assert
    expect(result.deliverySchedule).not.toBeNull();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ eventType: 'sales-order.delivery-scheduled' }),
      ]),
    );
  });

  it('throws SalesOrderNotFoundException when order not found', async () => {
    // Arrange
    repo.findById.mockResolvedValue(null);

    // Act & Assert
    await expect(useCase.execute('nonexistent', dto)).rejects.toThrow(SalesOrderNotFoundException);
  });

  it('throws when status is not PLANEJADA', async () => {
    // Arrange
    const order = makeOrder(SalesOrderStatus.CRIADA);
    repo.findById.mockResolvedValue(order);

    // Act & Assert
    await expect(useCase.execute('order-1', dto)).rejects.toThrow(/PLANEJADA/);
  });

  it('throws when delivery already scheduled', async () => {
    // Arrange
    const window = DeliveryWindow.create(new Date('2025-01-10'), '08:00', '10:00');
    const schedule = DeliverySchedule.create(window);
    const order = makeOrder(SalesOrderStatus.PLANEJADA, schedule);
    repo.findById.mockResolvedValue(order);

    // Act & Assert
    await expect(useCase.execute('order-1', dto)).rejects.toThrow(/already scheduled/);
  });
});
