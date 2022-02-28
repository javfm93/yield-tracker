import { Transaction } from '../../UserTransactions/domain/Transaction';

export class UserTransactions {
  private constructor(readonly value: Array<Transaction>) {}

  public static create(transactions: Array<Transaction>) {
    return new UserTransactions(transactions);
  }

  public filterBy(criteria: (transaction: Transaction) => boolean) {
    return this.value.filter(criteria);
  }
}
