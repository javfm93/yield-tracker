import * as faker from 'faker';
import { Hash } from '../../../../src/Contexts/Shared/domain/Hash';

export class HashGenerator {
  static random(): Hash {
    return new Hash(`0x${faker.random.alphaNumeric(64)}`);
  }
}
