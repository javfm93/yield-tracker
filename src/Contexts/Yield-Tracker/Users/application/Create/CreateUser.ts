import { UserRepository } from '../../domain/UserRepository';
import { UseCase } from '../../../../Shared/domain/UseCase';
import { User } from '../../domain/User';
import { EventBus } from '../../../../Shared/domain/EventBus';
import { Uuid } from '../../../../Shared/domain/value-object/Uuid';
import { Address } from '../../../../Shared/domain/address';

interface CreateUserArgs {
  id: Uuid;
  address: Address;
}

export class CreateUser implements UseCase<CreateUserArgs, void> {
  constructor(private userRepository: UserRepository, private eventBus: EventBus) {}

  async execute({ id, address }: CreateUserArgs): Promise<void> {
    const user = User.create(id, { address, transactions: [] });
    await this.userRepository.save(user);
    await this.eventBus.publish(user.pullDomainEvents());
  }
}
