import { ValueObject } from '@shared/domain/base/value-object.base';

interface DeliveryWindowProps {
  date: Date;
  startTime: string;
  endTime: string;
}

export class DeliveryWindow extends ValueObject<DeliveryWindowProps> {
  private readonly _date: Date;
  private readonly _startTime: string;
  private readonly _endTime: string;

  private constructor(props: DeliveryWindowProps) {
    super();
    this._date = props.date;
    this._startTime = props.startTime;
    this._endTime = props.endTime;
    this.validate(props);
  }

  protected validate(props: DeliveryWindowProps): void {
    if (props.startTime >= props.endTime) {
      throw new Error(`startTime "${props.startTime}" must be before endTime "${props.endTime}"`);
    }
  }

  static create(date: Date, startTime: string, endTime: string): DeliveryWindow {
    return new DeliveryWindow({ date, startTime, endTime });
  }

  static reconstitute(date: Date, startTime: string, endTime: string): DeliveryWindow {
    return new DeliveryWindow({ date, startTime, endTime });
  }

  get date(): Date {
    return this._date;
  }

  get startTime(): string {
    return this._startTime;
  }

  get endTime(): string {
    return this._endTime;
  }
}
