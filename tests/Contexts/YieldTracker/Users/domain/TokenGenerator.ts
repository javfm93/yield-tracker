import { AddressGenerator } from '../../../Shared/domain/AddressGenerator';
import {
  AvailableTokens,
  Token,
  TokenProps
} from '../../../../../src/Contexts/Yield-Tracker/UserSmartContracts/domain/Token';
import { TokenAddress } from '../../../../../src/Contexts/Yield-Tracker/UserSmartContracts/domain/TokenAddress';

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
