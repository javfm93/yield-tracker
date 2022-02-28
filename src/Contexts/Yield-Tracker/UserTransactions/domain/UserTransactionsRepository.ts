import { TransactionHash } from './TransactionHash';
import { Nullable } from '../../../Shared/domain/Nullable';
import { Transaction } from './Transaction';

export interface UserTransactionsRepository {
  save(userTransactions: Array<Transaction>): Promise<void>;

  search(id: TransactionHash): Promise<Nullable<Array<Transaction>>>;
}
