import { UserAddress } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/UserAddress';
import { AddressGenerator } from '../../../Shared/domain/AddressGenerator';

export class UserAddressGenerator {
  static create(value: string): UserAddress {
    return UserAddress.create(value);
  }

  static random(): UserAddress {
    return this.create(AddressGenerator.random().toString());
  }
}
