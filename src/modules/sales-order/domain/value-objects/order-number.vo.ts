import { ValueObject } from '@shared/domain/base/value-object.base';

interface OrderNumberProps {
  value: string;
}

export class OrderNumber extends ValueObject<OrderNumberProps> {
  private readonly _value: string;

  private constructor(value: string) {
    super();
    this._value = value;
    this.validate({ value });
  }

  protected validate(props: OrderNumberProps): void {
    const pattern = /^OV-\d{8}-\d{5}$/;
    if (!pattern.test(props.value)) {
      throw new Error(`Invalid OrderNumber format: ${props.value}`);
    }
  }

  static generate(): OrderNumber {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const seq = String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0');
    return new OrderNumber(`OV-${date}-${seq}`);
  }

  static reconstitute(value: string): OrderNumber {
    return new OrderNumber(value);
  }

  get value(): string {
    return this._value;
  }

  toString(): string {
    return this._value;
  }
}
