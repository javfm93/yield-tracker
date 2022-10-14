import { Address } from '../../../Shared/domain/Address';
import { AvailableSmartContractsAddress } from './smart-contract';

export class SmartContractAddress extends Address {
  private constructor(value: string) {
    super(value);
  }
  static create(value: string): SmartContractAddress {
    // @ts-ignore
    if (!Object.values(AvailableSmartContractsAddress).includes(value)) {
      throw Error(`[Domain:SmartContract]: Not valid smart-contract address, tried: ${value}`);
    }
    return new SmartContractAddress(value);
  }
}
