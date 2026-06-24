import { v4 as uuidv4 } from 'uuid';

export abstract class DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  abstract readonly eventType: string;

  constructor() {
    this.eventId = uuidv4();
    this.occurredAt = new Date();
  }
}
