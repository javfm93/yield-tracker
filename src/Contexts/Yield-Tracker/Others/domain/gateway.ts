import { Transaction } from './transaction';
import { AvailableTokens, Token } from './token';

export type TokensPrice = {
  [key in AvailableTokens]: string;
};

export interface Gateway {
  transactionsOf(address: string): Promise<Array<Transaction>>;
  getTokenPriceAt(token: Token, timestamp: string): Promise<string>;
  getCurrentTokensPrice(): Promise<TokensPrice>;
  getInputOf(transaction: Transaction): Promise<string>;
}
