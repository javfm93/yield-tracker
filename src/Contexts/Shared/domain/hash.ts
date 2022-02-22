import { ValueObject } from './ValueObject';

interface HashProps {
  hash: string;
}
export class Hash extends ValueObject<HashProps> {
  private constructor(private hash: string) {
    super({ hash });
  }

  public static create(hash: string): Hash {
    if (hash.length !== 66) {
      throw Error(`[Domain:Hash] Invalid hash length, hash was: ${hash}`);
    }

    return new Hash(hash.toLowerCase());
  }

  public isEqualTo(hash: Hash) {
    return this.toString() === hash.toString();
  }

  public toString(): string {
    return this.hash.toString();
  }
}
