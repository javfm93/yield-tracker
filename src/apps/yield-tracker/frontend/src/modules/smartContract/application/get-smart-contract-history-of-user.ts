import { Gateway } from '../domain/gateway';
import { SmartContract } from '../domain/smart-contract';
import { SmartContractHistory } from '../../../app/pages/HomePage/slice/types';
import { GetUserTransactionsWithSmartContract } from './get-user-transactions-with-smart-contract';
import { User } from '../domain/user';
import { TokensHistoricalPricesRepository } from '../domain/tokens-historical-prices-repository';
import { SmartContractTransactionsWithUserModel } from '../domain/smartContractTransactionsWithUser';

export class GetSmartContractHistoryOfUser {
  private getUserTransactionsWithSmartContract: GetUserTransactionsWithSmartContract;
  constructor(private api: Gateway, private tokensHistoricalPricesRepository: TokensHistoricalPricesRepository) {
    this.getUserTransactionsWithSmartContract = new GetUserTransactionsWithSmartContract(this.api);
  }

  public async execute(smartContract: SmartContract, user: User): Promise<SmartContractHistory> {
    const transactions = await this.getUserTransactionsWithSmartContract.execute(user, smartContract);
    const smartContractHistoryWithUser = new SmartContractTransactionsWithUserModel(smartContract, transactions, user);
    const contractHistory = smartContractHistoryWithUser.getHistory();
    this.tokensHistoricalPricesRepository.save(contractHistory.transactions);
    return contractHistory;
  }
}
