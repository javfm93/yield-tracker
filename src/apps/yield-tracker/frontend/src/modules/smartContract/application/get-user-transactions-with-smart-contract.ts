import { Gateway } from '../domain/gateway';
import { User } from '../domain/user';
import { Transaction } from '../domain/transaction';
import { AddTokenPriceToTransaction } from './add-token-price-to-transaction';
import { AvailablePlatforms, SmartContract } from '../domain/smart-contract';
import { take } from 'lodash';

export class GetUserTransactionsWithSmartContract {
  private addTokenPriceToTransaction: AddTokenPriceToTransaction;

  constructor(private api: Gateway) {
    this.addTokenPriceToTransaction = new AddTokenPriceToTransaction(api);
  }

  public async execute(user: User, smartContract: SmartContract): Promise<Array<Transaction>> {
    const addresses = smartContract.isMinting()
      ? [smartContract.address, smartContract.getMinterAddress()]
      : [smartContract.address];
    console.log(`Addresses to filter: ${addresses.join()}`);
    const transactions = user.transactionsWith(addresses);
    const isUserTakingMintedTokensIn = (tx: Transaction) => {
      return tx.isTransferOf(smartContract.getMintedToken()) && tx.isWithdrawOf(user.address);
    };
    const addTokenPriceTo = (txs: Array<Transaction>) =>
      take(txs, 30).map(async tx => this.addTokenPriceToTransaction.execute(tx));

    if (smartContract.getPlatform() === AvailablePlatforms.BUNNY) {
      console.log('filtering a bunny smart-contract', smartContract.getStakedToken().getSymbol());

      const isUserTakingProfitsIn = (tx: Transaction): boolean => {
        return tx.isTransferOf(smartContract.getRewardedToken()) && tx.isWithdrawOf(user.address);
      };

      const getTakingProfitsTransactions = (): Array<Transaction> => {
        return transactions.filter(tx => isUserTakingProfitsIn(tx));
      };

      const isAtTheSameTimeThanATakingProfitsTransaction = (tx: Transaction): boolean =>
        getTakingProfitsTransactions().filter(takeProfitTx => takeProfitTx.isAtTheSameTimeThan(tx)).length > 0;

      const minterTransactionsFromOtherContracts = (tx: Transaction): boolean => {
        if (isUserTakingMintedTokensIn(tx)) {
          return isAtTheSameTimeThanATakingProfitsTransaction(tx);
        }
        return true;
      };
      const contractTransactions = transactions.filter(minterTransactionsFromOtherContracts);
      return Promise.all(addTokenPriceTo(contractTransactions));
    } else if (smartContract.getPlatform() === AvailablePlatforms.ACRYPTOS) {
      console.log('filtering an acryptos smart-contract', smartContract.getStakedToken().getSymbol());
      const isWithdrawingTheMintedTokens = (tx: Transaction) =>
        tx.isWithdrawOf(user.address) &&
        addresses[1] &&
        tx.isDepositOf(addresses[1]) &&
        addresses[1].isEqualTo(smartContract.getMinterAddress());
      const transactionsWithInputPromise = take(transactions, 30).map(async tx => {
        if (isWithdrawingTheMintedTokens(tx)) {
          // if is smart contract minter giving the minted tokens add the input of the tx
          // always add the token price to the tx
          const input = await this.api.getInputOf(tx);
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
    } else {
      throw new Error('Not valid Platform');
    }
  }
}
