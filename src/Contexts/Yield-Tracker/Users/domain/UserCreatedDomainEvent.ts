import { DomainEvent } from '../../../Shared/domain/DomainEvent';

type CreateUserDomainEventBody = {
  readonly address: string;
  readonly eventName: string;
  readonly id: string;
};

export class UserCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'user.created';

  readonly address: string;

  constructor({
    id,
    eventId,
    occurredOn,
    address
  }: {
    id: string;
    address: string;
    eventId?: string;
    occurredOn?: Date;
  }) {
    super(UserCreatedDomainEvent.EVENT_NAME, id, eventId, occurredOn);
    this.address = address;
  }

  toPrimitive(): CreateUserDomainEventBody {
    const { address, aggregateId } = this;
    return {
      address,
      eventName: UserCreatedDomainEvent.EVENT_NAME,
      id: aggregateId
    };
  }

  static fromPrimitives(
    aggregateId: string,
    body: CreateUserDomainEventBody,
    eventId: string,
    occurredOn: Date
  ): DomainEvent {
    return new UserCreatedDomainEvent({
      id: aggregateId,
      address: body.address,
      eventId,
      occurredOn
    });
  }
}
