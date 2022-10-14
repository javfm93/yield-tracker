import {
  CreateTransactionProps,
  Transaction
} from '../../../../../src/Contexts/Yield-Tracker/Others/domain/transaction';
import * as faker from 'faker';
import { HashGenerator } from '../../../Shared/domain/HashGenerator';
import { AddressGenerator } from '../../../Shared/domain/AddressGenerator';
import { TokenGenerator } from './TokenGenerator';
import { TransactionHash } from '../../../../../src/Contexts/Yield-Tracker/UserSmartContracts/domain/TransactionHash';

export class TransactionGenerator {
  static create(hash: TransactionHash, props: CreateTransactionProps): Transaction {
    return Transaction.create(hash, props);
  }

  // todo: define timestamp format
  static random(): Transaction {
    const token = TokenGenerator.random();
    return this.create(HashGenerator.random(), {
      from: AddressGenerator.random(),
      to: AddressGenerator.random(),
      value: faker.datatype.float(4).toFixed(4),
      token,
      timeStamp: faker.date.past().toISOString()
    });
  }

  static randomBulk(): Array<Transaction> {
    return Array.from({ length: 5 }, this.random.bind(this));
  }
}
