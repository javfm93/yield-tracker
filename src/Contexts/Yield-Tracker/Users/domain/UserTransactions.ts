import { Transaction } from '../../../Shared/domain/Transaction';
import { Transactions } from '../../../Shared/domain/Transactions';

export class UserTransactions extends Transactions {
  private constructor(readonly value: Array<Transaction>) {
    super(value);
  }

  public static create(transactions: Array<Transaction>) {
    return new UserTransactions(transactions);
  }
}
