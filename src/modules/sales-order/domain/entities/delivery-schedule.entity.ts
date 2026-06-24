import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '@shared/domain/base/base-entity.base';
import { DeliveryWindow } from '../value-objects/delivery-window.vo';

export class DeliverySchedule extends BaseEntity<string> {
  private _deliveryWindow: DeliveryWindow;
  private _confirmed: boolean;

  private constructor(
    id: string,
    deliveryWindow: DeliveryWindow,
    confirmed: boolean,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._deliveryWindow = deliveryWindow;
    this._confirmed = confirmed;
  }

  static create(deliveryWindow: DeliveryWindow): DeliverySchedule {
    return new DeliverySchedule(uuidv4(), deliveryWindow, false);
  }

  static reconstitute(
    id: string,
    deliveryWindow: DeliveryWindow,
    confirmed: boolean,
    createdAt: Date,
    updatedAt: Date,
  ): DeliverySchedule {
    return new DeliverySchedule(id, deliveryWindow, confirmed, createdAt, updatedAt);
  }

  get deliveryWindow(): DeliveryWindow {
    return this._deliveryWindow;
  }

  get confirmed(): boolean {
    return this._confirmed;
  }

  confirm(): void {
    this._confirmed = true;
    this.updatedAt = new Date();
  }

  updateWindow(newWindow: DeliveryWindow): void {
    this._deliveryWindow = newWindow;
    this.updatedAt = new Date();
  }
}
