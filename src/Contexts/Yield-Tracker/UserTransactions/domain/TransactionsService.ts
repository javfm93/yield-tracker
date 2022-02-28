import { Transaction } from './Transaction';
import { Address } from '../../../Shared/domain/Address';

export interface TransactionsService {
  getTransactionsOf(address: Address): Promise<Array<Transaction>>;
  getInputOf(transaction: Transaction): Promise<string>;
}
