import { Nullable } from '../../../Shared/domain/Nullable';
import { Transaction } from '../../../Shared/domain/Transaction';
import { TransactionHash } from '../../../Shared/domain/TransactionHash';

export interface UserTransactionsRepository {
  save(userTransactions: Array<Transaction>): Promise<void>;

  search(id: TransactionHash): Promise<Nullable<Array<Transaction>>>;
}
