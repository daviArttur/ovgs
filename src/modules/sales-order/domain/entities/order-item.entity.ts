import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '@shared/domain/base/base-entity.base';

export class OrderItem extends BaseEntity<string> {
  private _itemId: string;
  private _quantity: number;

  private constructor(id: string, itemId: string, quantity: number, createdAt?: Date, updatedAt?: Date) {
    super(id, createdAt, updatedAt);
    this._itemId = itemId;
    this._quantity = quantity;
  }

  static create(itemId: string, quantity: number): OrderItem {
    if (quantity < 1) throw new Error('OrderItem quantity must be at least 1');
    return new OrderItem(uuidv4(), itemId, quantity);
  }

  static reconstitute(id: string, itemId: string, quantity: number, createdAt: Date, updatedAt: Date): OrderItem {
    return new OrderItem(id, itemId, quantity, createdAt, updatedAt);
  }

  get itemId(): string {
    return this._itemId;
  }

  get quantity(): number {
    return this._quantity;
  }
}
