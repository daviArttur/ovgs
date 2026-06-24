import { v4 as uuidv4 } from 'uuid';
import { AggregateRoot } from '@shared/domain/base/aggregate-root.base';
import { SalesOrderStatus } from './sales-order-status.enum';
import { OrderItem } from './order-item.entity';
import { DeliverySchedule } from './delivery-schedule.entity';
import { OrderNumber } from '../value-objects/order-number.vo';
import { DeliveryWindow } from '../value-objects/delivery-window.vo';
import { SalesOrderCreatedEvent } from '../events/sales-order-created.event';
import { SalesOrderStatusChangedEvent } from '../events/sales-order-status-changed.event';
import { DeliveryScheduledEvent } from '../events/delivery-scheduled.event';
import { DeliveryRescheduledEvent } from '../events/delivery-rescheduled.event';
import { DeliveryConfirmedEvent } from '../events/delivery-confirmed.event';
import { InvalidStatusTransitionException } from '../exceptions/invalid-status-transition.exception';
import { InvalidDeliverySchedulingStateException } from '../exceptions/invalid-delivery-scheduling-state.exception';
import { DeliveryAlreadyScheduledException } from '../exceptions/delivery-already-scheduled.exception';
import { NoDeliveryScheduleException } from '../exceptions/no-delivery-schedule.exception';

interface SalesOrderProps {
  orderNumber: OrderNumber;
  status: SalesOrderStatus;
  customerId: string;
  transportTypeId: string;
  items: OrderItem[];
  deliverySchedule: DeliverySchedule | null;
}

export class SalesOrder extends AggregateRoot {
  private static readonly VALID_TRANSITIONS: Map<SalesOrderStatus, SalesOrderStatus[]> = new Map([
    [SalesOrderStatus.CRIADA, [SalesOrderStatus.PLANEJADA]],
    [SalesOrderStatus.PLANEJADA, [SalesOrderStatus.AGENDADA]],
    [SalesOrderStatus.AGENDADA, [SalesOrderStatus.EM_TRANSPORTE]],
    [SalesOrderStatus.EM_TRANSPORTE, [SalesOrderStatus.ENTREGUE]],
    [SalesOrderStatus.ENTREGUE, []],
  ]);

  private _orderNumber: OrderNumber;
  private _status: SalesOrderStatus;
  private _customerId: string;
  private _transportTypeId: string;
  private _items: OrderItem[];
  private _deliverySchedule: DeliverySchedule | null;

  private constructor(
    id: string,
    props: SalesOrderProps,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._orderNumber = props.orderNumber;
    this._status = props.status;
    this._customerId = props.customerId;
    this._transportTypeId = props.transportTypeId;
    this._items = props.items;
    this._deliverySchedule = props.deliverySchedule;
  }

  static create(props: {
    orderNumber: OrderNumber;
    customerId: string;
    transportTypeId: string;
    items: OrderItem[];
  }): SalesOrder {
    if (props.items.length === 0) {
      throw new Error('SalesOrder must contain at least one item');
    }
    const order = new SalesOrder(uuidv4(), {
      orderNumber: props.orderNumber,
      status: SalesOrderStatus.CRIADA,
      customerId: props.customerId,
      transportTypeId: props.transportTypeId,
      items: props.items,
      deliverySchedule: null,
    });
    order.addDomainEvent(
      new SalesOrderCreatedEvent(
        order.id,
        order._orderNumber.value,
        order._customerId,
        order._transportTypeId,
      ),
    );
    return order;
  }

  static reconstitute(
    id: string,
    props: SalesOrderProps,
    createdAt: Date,
    updatedAt: Date,
  ): SalesOrder {
    return new SalesOrder(id, props, createdAt, updatedAt);
  }

  get orderNumber(): OrderNumber {
    return this._orderNumber;
  }

  get status(): SalesOrderStatus {
    return this._status;
  }

  get customerId(): string {
    return this._customerId;
  }

  get transportTypeId(): string {
    return this._transportTypeId;
  }

  get items(): OrderItem[] {
    return [...this._items];
  }

  get deliverySchedule(): DeliverySchedule | null {
    return this._deliverySchedule;
  }

  changeStatus(newStatus: SalesOrderStatus): void {
    const allowed = SalesOrder.VALID_TRANSITIONS.get(this._status) ?? [];
    if (!allowed.includes(newStatus)) {
      throw new InvalidStatusTransitionException(this._status, newStatus);
    }
    const previousStatus = this._status;
    this._status = newStatus;
    this.updatedAt = new Date();
    this.addDomainEvent(
      new SalesOrderStatusChangedEvent(this.id, previousStatus, newStatus),
    );
  }

  scheduleDelivery(window: DeliveryWindow): void {
    if (this._status !== SalesOrderStatus.PLANEJADA) {
      throw new InvalidDeliverySchedulingStateException(this._status, SalesOrderStatus.PLANEJADA);
    }
    if (this._deliverySchedule !== null) {
      throw new DeliveryAlreadyScheduledException();
    }
    this._deliverySchedule = DeliverySchedule.create(window);
    this.updatedAt = new Date();
    this.addDomainEvent(new DeliveryScheduledEvent(this.id, window));
  }

  rescheduleDelivery(window: DeliveryWindow): void {
    if (this._status !== SalesOrderStatus.AGENDADA) {
      throw new InvalidDeliverySchedulingStateException(this._status, SalesOrderStatus.AGENDADA);
    }
    if (this._deliverySchedule === null) {
      throw new NoDeliveryScheduleException();
    }
    const previousWindow = this._deliverySchedule.deliveryWindow;
    this._deliverySchedule.updateWindow(window);
    this.updatedAt = new Date();
    this.addDomainEvent(new DeliveryRescheduledEvent(this.id, previousWindow, window));
  }

  confirmDeliverySchedule(): void {
    if (this._status !== SalesOrderStatus.AGENDADA) {
      throw new InvalidDeliverySchedulingStateException(this._status, SalesOrderStatus.AGENDADA);
    }
    if (this._deliverySchedule === null) {
      throw new NoDeliveryScheduleException();
    }
    this._deliverySchedule.confirm();
    this.updatedAt = new Date();
    this.addDomainEvent(new DeliveryConfirmedEvent(this.id));
  }
}
