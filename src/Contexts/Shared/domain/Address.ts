import { ValueObject } from './ValueObject';

export class Address extends ValueObject<Address> {
  constructor(readonly value: string) {
    super();
    if (value.length !== 42) {
      throw Error('[Domain:Address] Invalid address length');
    }
    this.value = value.toLowerCase();
  }

  public isEqualTo(address: Address) {
    return this.toString() === address.toString();
  }

  public toString(): string {
    return this.value;
  }
}
