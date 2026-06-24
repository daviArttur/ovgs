export abstract class BaseEntity<T> {
  readonly id: T;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(id: T, createdAt?: Date, updatedAt?: Date) {
    this.id = id;
    this.createdAt = createdAt ?? new Date();
    this.updatedAt = updatedAt ?? new Date();
  }

  equals(other: BaseEntity<T>): boolean {
    if (other === null || other === undefined) return false;
    if (!(other instanceof BaseEntity)) return false;
    return this.id === other.id;
  }
}
