import { Nullable } from '../../../Shared/domain/Nullable';
import { SmartContract } from './smart-contract';
import { SmartContractAddress } from './SmartContractAddress';

export interface SmartContractRepository {
  save(user: SmartContract): Promise<void>;

  search(id: SmartContractAddress): Promise<Nullable<SmartContract>>;
}
