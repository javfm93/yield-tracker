import { Gateway } from '../domain/gateway';
import { BlockchainGateway } from '../domain/blockchain-gateway';
import { User } from '../domain/user';

export class GetUser {
  constructor(private api: Gateway, private blockchainGateway: BlockchainGateway) {}

  public async execute(): Promise<User> {
    const userAddress = await this.blockchainGateway.connectToWallet();
    const transactions = await this.api.transactionsOf(userAddress);

    return User.create(userAddress, { transactions });
  }
}
