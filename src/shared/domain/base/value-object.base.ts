export abstract class ValueObject<T> {
  protected abstract validate(props: T): void;

  equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) return false;
    if (other.constructor !== this.constructor) return false;
    return JSON.stringify(this) === JSON.stringify(other);
  }
}
