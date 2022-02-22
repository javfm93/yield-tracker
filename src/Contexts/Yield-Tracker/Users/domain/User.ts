import { Address } from '../../../Shared/domain/address';
import { AggregateRoot } from '../../../Shared/domain/AggregateRoot';
import { UserCreatedDomainEvent } from './UserCreatedDomainEvent';
import { Transaction } from '../../Others/domain/transaction';
import { UserAddress } from './UserAddress';
import { UserId } from './UserId';

export interface UserProps {
  address: UserAddress;
  transactions: Array<Transaction>;
}

interface UserPrimitives {
  id: string;
  address: string;
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
      address: this.props.address.toString()
    };
  }

  static fromPrimitives(plainData: UserPrimitives): User {
    return new User(UserId.create(plainData.id), { address: UserAddress.create(plainData.address), transactions: [] });
  }

  transactionsWith(smartContractAddresses: Array<Address>): Array<Transaction> {
    const transactions = smartContractAddresses.map(smartContractAddress =>
      this.props.transactions.filter(
        tokenTx => tokenTx.isDepositOf(smartContractAddress) || tokenTx.isWithdrawOf(smartContractAddress)
      )
    );
    // return transactions.flat();
    return transactions[0];
  }
}
