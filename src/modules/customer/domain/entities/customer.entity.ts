import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '@shared/domain/base/base-entity.base';

interface CustomerProps {
  name: string;
  document: string;
  authorizedTransportTypeIds: string[];
}

export class Customer extends BaseEntity<string> {
  private _name: string;
  private _document: string;
  private _authorizedTransportTypeIds: Set<string>;

  private constructor(
    id: string,
    props: CustomerProps,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._name = props.name;
    this._document = props.document;
    this._authorizedTransportTypeIds = new Set(props.authorizedTransportTypeIds);
  }

  static create(props: { name: string; document: string }): Customer {
    return new Customer(uuidv4(), {
      name: props.name,
      document: props.document,
      authorizedTransportTypeIds: [],
    });
  }

  static reconstitute(
    id: string,
    props: CustomerProps,
    createdAt: Date,
    updatedAt: Date,
  ): Customer {
    return new Customer(id, props, createdAt, updatedAt);
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get authorizedTransportTypeIds(): string[] {
    return Array.from(this._authorizedTransportTypeIds);
  }

  updateName(name: string): void {
    this._name = name;
    this.updatedAt = new Date();
  }

  authorizeTransportType(transportTypeId: string): void {
    this._authorizedTransportTypeIds.add(transportTypeId);
    this.updatedAt = new Date();
  }

  isTransportTypeAuthorized(transportTypeId: string): boolean {
    return this._authorizedTransportTypeIds.has(transportTypeId);
  }

  syncAuthorizedTransportTypes(ids: string[]): void {
    this._authorizedTransportTypeIds = new Set(ids);
    this.updatedAt = new Date();
  }
}
