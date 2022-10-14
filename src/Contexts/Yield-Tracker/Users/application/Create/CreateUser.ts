import { UserRepository } from '../../domain/UserRepository';
import { UseCase } from '../../../../Shared/domain/UseCase';
import { User } from '../../domain/User';
import { EventBus } from '../../../../Shared/domain/EventBus';
import { Uuid } from '../../../../Shared/domain/value-object/Uuid';
import { Address } from '../../../../Shared/domain/Address';
import { TransactionsService } from '../../../../Shared/domain/TransactionsService';

interface CreateUserArgs {
  id: Uuid;
  address: Address;
}

// todo add transactions service to the dependency injector
export class CreateUser implements UseCase<CreateUserArgs, void> {
  constructor(
    private userRepository: UserRepository,
    private eventBus: EventBus,
    private transactionsService: TransactionsService
  ) {}

  async execute({ id, address }: CreateUserArgs): Promise<void> {
    const userTransactions = await this.transactionsService.getTransactionsOf(address);
    const user = User.create(id, { address, transactions: userTransactions });
    await this.userRepository.save(user);
    await this.eventBus.publish(user.pullDomainEvents());
  }
}
