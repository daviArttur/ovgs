import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventBus } from '@shared/application/ports/event-bus.port';
import { DomainEvent } from '@shared/domain/base/domain-event.base';

@Injectable()
export class NestJsEventBus extends EventBus {
  constructor(private readonly eventEmitter: EventEmitter2) {
    super();
  }

  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.eventEmitter.emitAsync(event.eventType, event);
    }
  }
}
