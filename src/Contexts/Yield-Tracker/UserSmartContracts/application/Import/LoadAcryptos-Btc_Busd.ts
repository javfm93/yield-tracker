import { UseCase } from '../../../../Shared/domain/UseCase';
// import { EventBus } from '../../../../Shared/domain/EventBus';
import { Address } from '../../../../Shared/domain/Address';
import { SmartContractRepository } from '../../domain/SmartContractRepository';
import { AvailablePlatforms, SmartContract } from '../../domain/smart-contract';
import { Bunny__factory } from '../../../../../apps/yield-tracker/frontend/src/types/smart-contracts';
import { SmartContractType, SmartContractTypes } from '../../domain/smart-contract-type';
import { AvailableSmartContractsAddress } from '../../infrastructure/ethers-blockchain-gateway';
import { AvailableTokens, Token } from '../../../../Shared/domain/token';
import { EventBus } from '../../../../Shared/domain/EventBus';
import { TokenAddress } from '../../../../Shared/domain/TokenAddress';
import { SmartContractAddress } from '../../domain/SmartContractAddress';
import { TransactionsService } from '../../../../Shared/domain/TransactionsService';
import { TokenPriceService } from '../../domain/TokenPriceService';
import { take } from 'lodash';
import { Transaction } from '../../../../Shared/domain/Transaction';
// import { TransactionsService } from '../../domain/TransactionsService';
// import { UserTransactionsRepository } from '../../domain/UserTransactionsRepository';
// import { QueryBus } from '../../../../Shared/domain/QueryBus';
// import { User } from '../../../Users/domain/User';

interface LoadBunnyArgs {
  address: Address;
}

// todo: This smells like should be part of create user
// service should return a response type
// if the response is plural, we should type both, Transaction and Transactions
// https://github.com/CodelyTV/php-ddd-example/tree/0e79862df4a856e94d2cef0dd66b9d10946ff24b/src/Backoffice/Courses/Application

const BTCB_BUSD_LP_ADDRESS = '0xbe627707f079e32a54d323be0c61da02a28bd0bd';
const ACS_ADDRESS = '0x4197c6ef3879a08cd51e5560da5064b773aa1d29';
const MINTER_ADDRESS = '0xb1fa5d3c0111d8e9ac43a19ef17b281d5d4b474e';
const ACRYPTOS_BTC_BUSD_CONTRACT_ADDRESS = '0xbe627707f079e32a54d323be0c61da02a28bd0bd';

export class LoadAcryptosBtcBusd implements UseCase<LoadBunnyArgs, void> {
  private rewardedToken = AvailableTokens.CAKE_LP;
  private rewardedTokenAddress = TokenAddress.create(BTCB_BUSD_LP_ADDRESS);
  private stakedToken = AvailableTokens.CAKE_LP;
  private stakedTokenAddress = TokenAddress.create(BTCB_BUSD_LP_ADDRESS);
  private mintedToken = AvailableTokens.ACS;
  private mintedTokenAddress = TokenAddress.create(ACS_ADDRESS);
  private minterAddress = new Address(MINTER_ADDRESS);
  private smartContractAddress = SmartContractAddress.create(ACRYPTOS_BTC_BUSD_CONTRACT_ADDRESS);
  private smartContractType = SmartContractType.create(SmartContractTypes.FARM_DIFFERENT_TOKEN);

  constructor(
    private repository: SmartContractRepository,
    private eventBus: EventBus,
    private transactionService: TransactionsService,
    private tokenPriceService: TokenPriceService
  ) {}

  async execute({ address }: LoadBunnyArgs): Promise<void> {
    const tokensPrice = await this.tokenPriceService.getCurrentTokensPrice();
    const rewardedTokenProps = {
      symbol: this.rewardedToken,
      price: tokensPrice[this.rewardedToken]
    };
    const stakedTokenProps = {
      symbol: this.stakedToken,
      price: tokensPrice[this.stakedToken]
    };
    const mintedTokenProps = {
      symbol: this.mintedToken,
      price: tokensPrice[this.mintedToken]
    };
    const defaultProps = { apr: '0', tvl: '0', userBalance: '0', userProfit: '0' };

    const smartContract = SmartContract.create(this.smartContractAddress, {
      ...defaultProps,
      platform: AvailablePlatforms.ACRYPTOS,
      rewardedToken: Token.create(this.rewardedTokenAddress, rewardedTokenProps),
      stakedToken: Token.create(this.stakedTokenAddress, stakedTokenProps),
      mintedToken: Token.create(this.mintedTokenAddress, mintedTokenProps),
      type: this.smartContractType,
      minterAddress: this.minterAddress,
      userId: address
    });
    const transactions = await this.getUserTransactionsWithSmartContract(address, smartContract);
    // const smartContractHistoryWithUser = new SmartContractTransactionsWithUserModel(
    //   smartContract,
    //   transactions,
    //   user
    // );
    // const userHistory = smartContractHistoryWithUser.getHistory();
    // this.tokensHistoricalPricesRepository.save(userHistory.transactions);
    // smartContract.setUserHistory

    // calculate the history of the user

    // const user: User = await this.queryBus.ask({
    /* get user by id */
    // });
    // const userTransactions = await this.service.transactionsOf(user.address);
    await this.repository.save(smartContract);
    await this.eventBus.publish(smartContract.pullDomainEvents());
  }

  async getUserTransactionsWithSmartContract(userAddress: Address, smartContract: SmartContract) {
    const addresses = [smartContract.address, this.minterAddress];
    const userTransactions = await this.transactionService.getTransactionsOf(userAddress);
    const transactions = userTransactions.transactionsWith(addresses);

    // todo add the input to the transactions
    const isUserTakingMintedTokensIn = (tx: Transaction) =>
      tx.isTransferOf(this.mintedToken) && tx.isWithdrawOf(userAddress);

    // todo: add token price on creation?
    const addTokenPriceTo = (txs: Array<Transaction>) =>
      take(txs, 30).map(async tx => this.addTokenPriceToTransaction.execute(tx));

    const isWithdrawingTheMintedTokens = (tx: Transaction) =>
      tx.isWithdrawOf(userAddress) && tx.isDepositOf(this.minterAddress);

    // todo: can we bulk get the inputs
    const transactionsWithInputPromise = take(transactions, 30).map(async tx => {
      if (isWithdrawingTheMintedTokens(tx)) {
        // if is smart contract minter giving the minted tokens add the input of the tx
        // always add the token price to the tx
        // todo: return from cache, if not in cache, store it and return
        const input = await this.transactionService.getInputOf(tx);
        tx.setInput(input);
      }
      return tx;
    });
    const transactionsWithInput = await Promise.all(transactionsWithInputPromise);

    // cache the fetched inputs of the tx
    let transactionsInput = JSON.parse(localStorage.getItem('transactionsInput') ?? '{}');
    transactionsWithInput.forEach(tx => {
      if (tx.getInput && !transactionsInput[tx.hash.toString()]) {
        transactionsInput = { ...transactionsInput, [tx.hash.toString()]: tx.getInput };
      }
    });

    localStorage.setItem('transactionsInput', JSON.stringify(transactionsInput));

    // if the input is not the staked token then the minted tokens are not from this contract
    const contractTransactions = transactionsWithInput.filter(tx => {
      if (isUserTakingMintedTokensIn(tx)) {
        return tx.inputIncludes(smartContract.getStakedToken());
      }
      return true;
    });
    return Promise.all(addTokenPriceTo(contractTransactions));
  }
}
