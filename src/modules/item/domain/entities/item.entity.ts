import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '@shared/domain/base/base-entity.base';

interface ItemProps {
  sku: string;
  name: string;
  description: string | null;
}

export class Item extends BaseEntity<string> {
  private _sku: string;
  private _name: string;
  private _description: string | null;

  private constructor(
    id: string,
    props: ItemProps,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._sku = props.sku;
    this._name = props.name;
    this._description = props.description;
  }

  static create(props: { sku: string; name: string; description?: string }): Item {
    return new Item(uuidv4(), {
      sku: props.sku,
      name: props.name,
      description: props.description ?? null,
    });
  }

  static reconstitute(
    id: string,
    props: ItemProps,
    createdAt: Date,
    updatedAt: Date,
  ): Item {
    return new Item(id, props, createdAt, updatedAt);
  }

  get sku(): string {
    return this._sku;
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }
}
