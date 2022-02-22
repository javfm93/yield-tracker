import { UserAddressGenerator } from './UserAddressGenerator';
import { User } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/User';
import { UserAddress } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/UserAddress';
import { UserId } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/UserId';
import { CreateUserCommand } from '../../../../../src/Contexts/Yield-Tracker/Users/application/Create/CreateUserCommand';
import { UserIdGenerator } from './UserIdGenerator';

export class UserGenerator {
  static create(id: UserId, address: UserAddress): User {
    return User.create(id, { address, transactions: [] });
  }

  static fromCommand(command: CreateUserCommand): User {
    return this.create(UserIdGenerator.create(command.id), UserAddressGenerator.create(command.address));
  }

  static random(): User {
    return this.create(UserIdGenerator.random(), UserAddressGenerator.random());
  }
}
