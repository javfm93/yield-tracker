import * as faker from 'faker';
import { Address } from '../../../../src/Contexts/Shared/domain/Address';

export class AddressGenerator {
  static random(): Address {
    return new Address(`0x${faker.random.alphaNumeric(40)}`);
  }
}
