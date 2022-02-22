import { HttpGateway } from '../infrastructure/http-gateway';
import { EthersBlockchainGateway } from '../infrastructure/ethers-blockchain-gateway';
import { LocalStorageTokensHistoricalPricesRepository } from '../infrastructure/localStorage-tokens-historical-prices-repository';
import { GetUser } from './get-user';
import { GetSmartContract } from './get-smart-contract';
import { SmartContract } from '../domain/smart-contract';

export enum AvailableSmartContractsAddress {
  BUNNY = '0xcadc8cb26c8c7cb46500e61171b5f27e9bd7889d',
  CAKE = '0xedfcb78e73f7ba6ad2d829bf5d462a0924da28ed',
  BUNNY_BNB_FLIP_BOOST = '0x69ff781cf86d42af9bf93c06b8be0f16a2905cbc',
  ACRYPTOS_BTC_BUSD = '0xbe627707f079e32a54d323be0c61da02a28bd0bd',
}

export type UserSmartContracts = {
  [key in AvailableSmartContractsAddress]: SmartContract;
};

export const getUserSmartContracts = async (): Promise<UserSmartContracts> => {
  const httpGateway = new HttpGateway();
  const blockchainGateway = new EthersBlockchainGateway();
  const localStorage = new LocalStorageTokensHistoricalPricesRepository();

  const getUser = new GetUser(httpGateway, blockchainGateway);
  const user = await getUser.execute();
  const getSmartContract = new GetSmartContract(httpGateway, localStorage, blockchainGateway);
  const bunnySmartContract = await getSmartContract.execute(AvailableSmartContractsAddress.BUNNY, user);
  const cakeSmartContract = await getSmartContract.execute(AvailableSmartContractsAddress.CAKE, user);
  const bunnyBnbFlipBoostContract = await getSmartContract.execute(
    AvailableSmartContractsAddress.BUNNY_BNB_FLIP_BOOST,
    user,
  );
  const acryptosBtcBusdContract = await getSmartContract.execute(
    AvailableSmartContractsAddress.ACRYPTOS_BTC_BUSD,
    user,
  );

  return {
    [AvailableSmartContractsAddress.BUNNY]: bunnySmartContract,
    [AvailableSmartContractsAddress.CAKE]: cakeSmartContract,
    [AvailableSmartContractsAddress.BUNNY_BNB_FLIP_BOOST]: bunnyBnbFlipBoostContract,
    [AvailableSmartContractsAddress.ACRYPTOS_BTC_BUSD]: acryptosBtcBusdContract,
  };
};
