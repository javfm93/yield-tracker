import { DomainEventClass } from '../../../../Shared/domain/DomainEvent';
import { DomainEventSubscriber } from '../../../../Shared/domain/DomainEventSubscriber';
import { UserCreatedDomainEvent } from '../../../Users/domain/UserCreatedDomainEvent';
// import { UserId } from '../../../Users/domain/UserId';

export class ImportUserTransactionsOnUserCreated
  implements DomainEventSubscriber<UserCreatedDomainEvent>
{
  // constructor(private importUserTransactions: ImportUserTransactions) {}

  subscribedTo(): DomainEventClass[] {
    return [UserCreatedDomainEvent];
  }

  async on(domainEvent: UserCreatedDomainEvent) {
    // await this.importUserTransactions.execute(UserId.create(domainEvent.aggregateId));
  }
}
