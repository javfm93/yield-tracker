import { Uuid } from './value-object/Uuid';

export abstract class DomainEvent {
  static EVENT_NAME: string;
  static fromPrimitives: (...args: any[]) => any;
  readonly eventName: string;
  readonly aggregateId: string;
  readonly eventId: string;
  readonly occurredOn: Date;

  constructor(eventName: string, aggregateId: string, eventId?: string, occurredOn?: Date) {
    this.eventName = eventName;
    this.aggregateId = aggregateId;
    this.eventId = eventId || Uuid.random().toString();
    this.occurredOn = occurredOn || new Date();
  }

  abstract toPrimitive(): Object;
}

export type DomainEventClass = { EVENT_NAME: string; fromPrimitives(...args: any[]): DomainEvent };
