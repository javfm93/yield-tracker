import { DomainEvent } from '../../../Shared/domain/DomainEvent';

type UserSmartContractCreatedBody = {
  readonly userId: string;
  readonly eventName: string;
  readonly id: string;
};

export type UserSmartContractCreatedProps = {
  id: string;
  userId: string;
  eventId?: string;
  occurredOn?: Date;
};

export class UserSmartContractCreated extends DomainEvent {
  static readonly EVENT_NAME = 'user.smartContract.created';
  readonly userId: string;

  constructor(props: UserSmartContractCreatedProps) {
    const { id, eventId, occurredOn } = props;
    super(UserSmartContractCreated.EVENT_NAME, id, eventId, occurredOn);
    this.userId = props.userId;
  }

  toPrimitive(): UserSmartContractCreatedBody {
    const { aggregateId, userId } = this;
    return {
      userId,
      eventName: UserSmartContractCreated.EVENT_NAME,
      id: aggregateId
    };
  }

  static fromPrimitives(
    aggregateId: string,
    body: UserSmartContractCreatedBody,
    eventId: string,
    occurredOn: Date
  ): DomainEvent {
    return new UserSmartContractCreated({
      id: aggregateId,
      userId: body.userId,
      eventId,
      occurredOn
    });
  }
}
