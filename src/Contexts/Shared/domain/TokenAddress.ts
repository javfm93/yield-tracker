import { Address } from './Address';

export class TokenAddress extends Address {
  private constructor(value: string) {
    super(value);
  }
  static create(value: string): TokenAddress {
    return new TokenAddress(value);
  }
}
