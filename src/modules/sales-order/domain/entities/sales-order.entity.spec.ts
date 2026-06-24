import { SalesOrder } from './sales-order.entity';
import { SalesOrderStatus } from './sales-order-status.enum';
import { OrderItem } from './order-item.entity';
import { OrderNumber } from '../value-objects/order-number.vo';
import { DeliveryWindow } from '../value-objects/delivery-window.vo';
import { SalesOrderCreatedEvent } from '../events/sales-order-created.event';
import { SalesOrderStatusChangedEvent } from '../events/sales-order-status-changed.event';
import { DeliveryScheduledEvent } from '../events/delivery-scheduled.event';
import { InvalidStatusTransitionException } from '../exceptions/invalid-status-transition.exception';

function makeOrder(status?: SalesOrderStatus): SalesOrder {
  const items = [OrderItem.create('item-1', 2)];
  const order = SalesOrder.create({
    orderNumber: OrderNumber.generate(),
    customerId: 'customer-1',
    transportTypeId: 'tt-1',
    items,
  });
  order.clearDomainEvents();
  if (status && status !== SalesOrderStatus.CRIADA) {
    return SalesOrder.reconstitute(
      order.id,
      {
        orderNumber: order.orderNumber,
        status,
        customerId: order.customerId,
        transportTypeId: order.transportTypeId,
        items: order.items,
        deliverySchedule: null,
      },
      order.createdAt,
      order.updatedAt,
    );
  }
  return order;
}

describe('SalesOrder entity', () => {
  describe('create()', () => {
    it('emits SalesOrderCreatedEvent on creation', () => {
      // Act
      const order = SalesOrder.create({
        orderNumber: OrderNumber.generate(),
        customerId: 'c-1',
        transportTypeId: 'tt-1',
        items: [OrderItem.create('item-1', 1)],
      });

      // Assert
      const events = order.getDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(SalesOrderCreatedEvent);
    });

    it('throws if items array is empty', () => {
      // Act & Assert
      expect(() =>
        SalesOrder.create({
          orderNumber: OrderNumber.generate(),
          customerId: 'c-1',
          transportTypeId: 'tt-1',
          items: [],
        }),
      ).toThrow('SalesOrder must contain at least one item');
    });
  });

  describe('changeStatus() — valid transitions', () => {
    it('CRIADA → PLANEJADA', () => {
      // Arrange
      const order = makeOrder(SalesOrderStatus.CRIADA);

      // Act
      order.changeStatus(SalesOrderStatus.PLANEJADA);

      // Assert
      expect(order.status).toBe(SalesOrderStatus.PLANEJADA);
    });

    it('PLANEJADA → AGENDADA', () => {
      // Arrange
      const order = makeOrder(SalesOrderStatus.PLANEJADA);

      // Act
      order.changeStatus(SalesOrderStatus.AGENDADA);

      // Assert
      expect(order.status).toBe(SalesOrderStatus.AGENDADA);
    });

    it('AGENDADA → EM_TRANSPORTE', () => {
      // Arrange
      const order = makeOrder(SalesOrderStatus.AGENDADA);

      // Act
      order.changeStatus(SalesOrderStatus.EM_TRANSPORTE);

      // Assert
      expect(order.status).toBe(SalesOrderStatus.EM_TRANSPORTE);
    });

    it('EM_TRANSPORTE → ENTREGUE', () => {
      // Arrange
      const order = makeOrder(SalesOrderStatus.EM_TRANSPORTE);

      // Act
      order.changeStatus(SalesOrderStatus.ENTREGUE);

      // Assert
      expect(order.status).toBe(SalesOrderStatus.ENTREGUE);
    });

    it('emits SalesOrderStatusChangedEvent on valid transition', () => {
      // Arrange
      const order = makeOrder(SalesOrderStatus.CRIADA);

      // Act
      order.changeStatus(SalesOrderStatus.PLANEJADA);

      // Assert
      const events = order.getDomainEvents();
      expect(events[0]).toBeInstanceOf(SalesOrderStatusChangedEvent);
      const evt = events[0] as SalesOrderStatusChangedEvent;
      expect(evt.previousStatus).toBe(SalesOrderStatus.CRIADA);
      expect(evt.newStatus).toBe(SalesOrderStatus.PLANEJADA);
    });
  });

  describe('changeStatus() — invalid transitions', () => {
    it('CRIADA → AGENDADA throws', () => {
      // Arrange
      const order = makeOrder(SalesOrderStatus.CRIADA);

      // Act & Assert
      expect(() => order.changeStatus(SalesOrderStatus.AGENDADA)).toThrow(
        InvalidStatusTransitionException,
      );
    });

    it('CRIADA → ENTREGUE throws', () => {
      // Arrange
      const order = makeOrder(SalesOrderStatus.CRIADA);

      // Act & Assert
      expect(() => order.changeStatus(SalesOrderStatus.ENTREGUE)).toThrow(
        InvalidStatusTransitionException,
      );
    });

    it('ENTREGUE → any throws', () => {
      // Arrange
      const order = makeOrder(SalesOrderStatus.ENTREGUE);

      // Act & Assert
      expect(() => order.changeStatus(SalesOrderStatus.CRIADA)).toThrow(
        InvalidStatusTransitionException,
      );
    });
  });

  describe('scheduleDelivery()', () => {
    it('schedules delivery when status is PLANEJADA', () => {
      // Arrange
      const order = makeOrder(SalesOrderStatus.PLANEJADA);
      const window = DeliveryWindow.create(new Date('2025-01-15'), '09:00', '12:00');

      // Act
      order.scheduleDelivery(window);

      // Assert
      expect(order.deliverySchedule).not.toBeNull();
      expect(order.deliverySchedule!.deliveryWindow).toBe(window);
      const events = order.getDomainEvents();
      expect(events[0]).toBeInstanceOf(DeliveryScheduledEvent);
    });

    it('throws when status is not PLANEJADA', () => {
      // Arrange
      const order = makeOrder(SalesOrderStatus.CRIADA);
      const window = DeliveryWindow.create(new Date('2025-01-15'), '09:00', '12:00');

      // Act & Assert
      expect(() => order.scheduleDelivery(window)).toThrow(/PLANEJADA/);
    });

    it('throws when already scheduled', () => {
      // Arrange
      const order = makeOrder(SalesOrderStatus.PLANEJADA);
      const window = DeliveryWindow.create(new Date('2025-01-15'), '09:00', '12:00');
      order.scheduleDelivery(window);

      // Act & Assert
      expect(() => order.scheduleDelivery(window)).toThrow(/already scheduled/);
    });
  });

  describe('rescheduleDelivery()', () => {
    it('reschedules when status is AGENDADA', () => {
      // Arrange
      const window1 = DeliveryWindow.create(new Date('2025-01-15'), '09:00', '12:00');
      const window2 = DeliveryWindow.create(new Date('2025-01-20'), '14:00', '17:00');

      const planejadaOrder = makeOrder(SalesOrderStatus.PLANEJADA);
      planejadaOrder.scheduleDelivery(window1);

      const agendadaOrder = SalesOrder.reconstitute(
        planejadaOrder.id,
        {
          orderNumber: planejadaOrder.orderNumber,
          status: SalesOrderStatus.AGENDADA,
          customerId: planejadaOrder.customerId,
          transportTypeId: planejadaOrder.transportTypeId,
          items: planejadaOrder.items,
          deliverySchedule: planejadaOrder.deliverySchedule,
        },
        planejadaOrder.createdAt,
        planejadaOrder.updatedAt,
      );

      // Act
      agendadaOrder.rescheduleDelivery(window2);

      // Assert
      expect(agendadaOrder.deliverySchedule!.deliveryWindow).toBe(window2);
    });

    it('throws when status is not AGENDADA', () => {
      // Arrange
      const order = makeOrder(SalesOrderStatus.PLANEJADA);
      const window = DeliveryWindow.create(new Date('2025-01-15'), '09:00', '12:00');

      // Act & Assert
      expect(() => order.rescheduleDelivery(window)).toThrow(/AGENDADA/);
    });
  });
});
