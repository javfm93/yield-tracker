import { User } from './User';
import { SmartContract } from './smart-contract';

export interface BlockchainGateway {
  connectToWallet(): Promise<string>;
  getSmartContractInformationForUser(address: string, user: User): Promise<SmartContract>;
}
