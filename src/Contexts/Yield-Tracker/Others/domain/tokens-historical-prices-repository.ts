import { Transaction } from './transaction';

export interface TokensHistoricalPricesRepository {
  save(transactions: Array<Transaction>): void;
  find(token: string, timestamp: string): string | null;
}
