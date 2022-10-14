import { Address } from './Address';
import { Transactions } from './Transactions';
import { Transaction } from './Transaction';

export interface TransactionsService {
  getTransactionsOf(address: Address): Promise<Transactions>;
  getInputOf(transaction: Transaction): Promise<string>;
}
