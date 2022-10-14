import { AvailableTokens, Token } from '../../Others/domain/token';

export type TokensPrice = {
  [key in AvailableTokens]: string;
};

export interface TokenPriceService {
  getTokenPriceAt(token: Token, timestamp: string): Promise<string>;
  getCurrentTokensPrice(): Promise<TokensPrice>;
}
