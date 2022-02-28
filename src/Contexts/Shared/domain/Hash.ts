import { ValueObject } from './ValueObject';

export class Hash extends ValueObject<Hash> {
  constructor(readonly value: string) {
    super();
    if (value.length !== 66) {
      throw Error(`[Domain:Hash] Invalid hash length, hash was: ${value}`);
    }
    this.value = value.toLowerCase();
  }

  public isEqualTo(hash: Hash) {
    return this.toString() === hash.toString();
  }

  public toString(): string {
    return this.value;
  }
}
