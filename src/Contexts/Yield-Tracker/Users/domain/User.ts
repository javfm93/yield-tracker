// import { Address } from '../../../Shared/domain/Address';
import { AggregateRoot } from '../../../Shared/domain/AggregateRoot';
import { UserCreatedDomainEvent } from './UserCreatedDomainEvent';
// import { Transaction } from '../../Others/domain/transaction';
import { UserAddress } from './UserAddress';
import { UserId } from './UserId';
import { UserTransactions } from './UserTransactions';

export interface UserProps {
  address: UserAddress;
  transactions: UserTransactions;
}

interface UserPrimitives {
  id: string;
  address: string;
  transactions: UserTransactions;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(id: UserId, props: UserProps) {
    super(id, props);
  }

  public static create(id: UserId, props: UserProps): User {
    const user = new User(id, props);
    user.record(
      new UserCreatedDomainEvent({
        id: user.id.toString(),
        address: user.props.address.toString()
      })
    );
    return user;
  }

  toPrimitives(): UserPrimitives {
    return {
      id: this.id.toString(),
      address: this.props.address.toString(),
      transactions: this.props.transactions
    };
  }

  static fromPrimitives(plainData: UserPrimitives): User {
    return new User(UserId.create(plainData.id), {
      address: UserAddress.create(plainData.address),
      transactions: plainData.transactions
    });
  }

  // transactionsWith(smartContractAddresses: Array<Address>): Array<Transaction> {
  //   return this.props.transactions.transactionsWith(smartContractAddresses);
  // }
}
