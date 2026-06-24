import { DomainEvent } from '@shared/domain/base/domain-event.base';

export abstract class EventBus {
  abstract publish(events: DomainEvent[]): Promise<void>;
}
