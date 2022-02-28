import { UseCase } from '../../../../Shared/domain/UseCase';
// import { EventBus } from '../../../../Shared/domain/EventBus';
import { UserId } from '../../../Users/domain/UserId';
// import { TransactionsService } from '../../domain/TransactionsService';
// import { UserTransactionsRepository } from '../../domain/UserTransactionsRepository';
// import { QueryBus } from '../../../../Shared/domain/QueryBus';
// import { User } from '../../../Users/domain/User';

interface ImportUserTransactionsArgs {
  id: UserId;
}

// todo: This smells like should be part of create user
// service should return a response type
// if the response is plural, we should type both, Transaction and Transactions
// https://github.com/CodelyTV/php-ddd-example/tree/0e79862df4a856e94d2cef0dd66b9d10946ff24b/src/Backoffice/Courses/Application
export class ImportUserTransactions implements UseCase<ImportUserTransactionsArgs, void> {
  constructor() {}
  // private repository: UserTransactionsRepository,
  // private queryBus: QueryBus,
  // private eventBus: EventBus,
  // private service: TransactionsService

  async execute({ id }: ImportUserTransactionsArgs): Promise<void> {
    // const user: User = await this.queryBus.ask({
    /* get user by id */
    // });
    // const userTransactions = await this.service.transactionsOf(user.address);
    // await this.repository.save(userTransactions);
    // await this.eventBus.publish(userTransactions.pullDomainEvents());
  }
}
