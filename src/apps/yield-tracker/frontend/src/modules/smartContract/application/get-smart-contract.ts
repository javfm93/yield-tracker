import { SmartContract } from '../domain/smart-contract';
import { BlockchainGateway } from '../domain/blockchain-gateway';
import { User } from '../domain/user';
import { GetSmartContractHistoryOfUser } from './get-smart-contract-history-of-user';
import { HttpGateway } from '../infrastructure/http-gateway';
import { TokensHistoricalPricesRepository } from '../domain/tokens-historical-prices-repository';

export class GetSmartContract {
  private getSmartContractHistoryOfUser;
  constructor(
    private http: HttpGateway,
    tokensHistoricalPricesRepository: TokensHistoricalPricesRepository,
    private blockchainGateway: BlockchainGateway
  ) {
    this.getSmartContractHistoryOfUser = new GetSmartContractHistoryOfUser(http, tokensHistoricalPricesRepository);
  }

  public async execute(smartContractAddress: string, user: User): Promise<SmartContract> {
    const smartContract = await this.blockchainGateway.getSmartContractInformationForUser(smartContractAddress, user);
    const tokensPrice = await this.http.getCurrentTokensPrice();
    smartContract.addTokensPrice(tokensPrice);
    smartContract.setUserHistory(await this.getSmartContractHistoryOfUser.execute(smartContract, user));
    return smartContract;
  }
}
