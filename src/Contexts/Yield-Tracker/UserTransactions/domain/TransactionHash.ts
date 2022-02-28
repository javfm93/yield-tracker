import { Hash } from '../../../Shared/domain/Hash';

export class TransactionHash extends Hash {
  private constructor(value: string) {
    super(value);
  }
  static create(value: string): TransactionHash {
    return new TransactionHash(value);
  }
}
