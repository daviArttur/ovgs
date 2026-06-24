import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '@shared/domain/base/base-entity.base';

interface TransportTypeProps {
  name: string;
  description: string | null;
}

export class TransportType extends BaseEntity<string> {
  private _name: string;
  private _description: string | null;

  private constructor(
    id: string,
    props: TransportTypeProps,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._name = props.name;
    this._description = props.description;
  }

  static create(props: { name: string; description?: string }): TransportType {
    return new TransportType(uuidv4(), {
      name: props.name,
      description: props.description ?? null,
    });
  }

  static reconstitute(
    id: string,
    props: TransportTypeProps,
    createdAt: Date,
    updatedAt: Date,
  ): TransportType {
    return new TransportType(id, props, createdAt, updatedAt);
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  updateName(name: string): void {
    this._name = name;
    this.updatedAt = new Date();
  }

  updateDescription(description: string | null): void {
    this._description = description;
    this.updatedAt = new Date();
  }
}
