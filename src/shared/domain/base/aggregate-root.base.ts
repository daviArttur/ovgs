import { BaseEntity } from './base-entity.base';
import { DomainEvent } from './domain-event.base';

export abstract class AggregateRoot extends BaseEntity<string> {
  private _domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  getDomainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
