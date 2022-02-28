import { AddressGenerator } from '../../../Shared/domain/AddressGenerator';
import {
  AvailableTokens,
  Token,
  TokenProps
} from '../../../../../src/Contexts/Yield-Tracker/UserTransactions/domain/Token';
import { TokenAddress } from '../../../../../src/Contexts/Yield-Tracker/UserTransactions/domain/TokenAddress';

export class TokenGenerator {
  static create(hash: TokenAddress, props: TokenProps): Token {
    return Token.create(hash, props);
  }

  static random(): Token {
    return this.create(AddressGenerator.random(), {
      symbol: AvailableTokens.ACS
    });
  }
}
