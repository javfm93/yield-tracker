import { Address } from '../../../Shared/domain/address';

export class UserAddress extends Address {
  private constructor(value: string) {
    super(value);
  }
  static create(value: string): UserAddress {
    return new UserAddress(value);
  }
}
