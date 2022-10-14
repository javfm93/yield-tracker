import { UserAddressGenerator } from './UserAddressGenerator';
import { User } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/User';
import { UserAddress } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/UserAddress';
import { UserId } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/UserId';
import { CreateUserCommand } from '../../../../../src/Contexts/Yield-Tracker/Users/application/Create/CreateUserCommand';
import { UserIdGenerator } from './UserIdGenerator';
import { UserTransactions } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/UserTransactions';
import { Transaction } from '../../../../../src/Contexts/Yield-Tracker/UserSmartContracts/domain/Transaction';
import { TransactionGenerator } from './TransactionGenerator';

export class UserGenerator {
  static create(id: UserId, address: UserAddress, transactions: UserTransactions): User {
    return User.create(id, { address, transactions });
  }

  static fromCommand(command: CreateUserCommand, transactions: Array<Transaction>): User {
    return this.create(
      UserIdGenerator.create(command.id),
      UserAddressGenerator.create(command.address),
      UserTransactions.create(transactions)
    );
  }

  static random(): User {
    return this.create(
      UserIdGenerator.random(),
      UserAddressGenerator.random(),
      UserTransactions.create(TransactionGenerator.randomBulk())
    );
  }
}
