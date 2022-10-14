import { Transaction } from './Transaction';
import { Address } from './Address';

export class Transactions {
  constructor(readonly value: Array<Transaction>) {}

  filterBy(criteria: (transaction: Transaction) => boolean) {
    return this.value.filter(criteria);
  }

  transactionsWith(addresses: Array<Address>): Transactions {
    const transactions = addresses.map(address =>
      this.filterBy(
        transaction => transaction.isDepositOf(address) || transaction.isWithdrawOf(address)
      )
    );
    return new Transactions(transactions.flat());
  }
}
