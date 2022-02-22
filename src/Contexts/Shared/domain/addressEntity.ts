import { Address } from './address';

const isEntity = (v: any): v is AddressEntity<any> => v instanceof AddressEntity;

export abstract class AddressEntity<T> {
  readonly address: Address;
  public readonly props: T;

  constructor(address: string, props: T) {
    this.address = Address.create(address);
    this.props = props;
  }

  public isEqualTo(entity?: AddressEntity<T>): boolean {
    if (!entity) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    if (!isEntity(entity)) {
      return false;
    }

    return this.address.isEqualTo(entity.address);
  }
}
