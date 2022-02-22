import { Transaction } from './transaction';
import { User } from './User';
import { SmartContract } from './smart-contract';
import { BigNumber } from 'ethers';

export interface SmartContractHistory {
  transactions: Array<Transaction>;
  withdrawnProfit: string;
  withdrawnMinted: string;
}

export interface SmartContractTransactionsWithUserModelAttributes {
  transactions: Array<Transaction>;
  user: User;
  smartContract: SmartContract;
}

export interface SmartContractTransactionsWithUserModelMethods {
  getStakedTokenTransactions(): Array<Transaction>;
  getTakingProfitsTransactions(): Array<Transaction>;
  getTakingMintedTokensTransactions(): Array<Transaction>;
  getHistory: () => SmartContractHistory;
}

export interface SmartContractTransactionsWithUser
  extends SmartContractTransactionsWithUserModelAttributes,
    SmartContractTransactionsWithUserModelMethods {}

export class SmartContractTransactionsWithUserModel implements SmartContractTransactionsWithUser {
  constructor(public smartContract: SmartContract, public transactions: Array<Transaction>, public user: User) {}

  public getStakedTokenTransactions(): Array<Transaction> {
    return this.transactions.filter(tx => tx.isTransferOf(this.smartContract.getStakedToken()));
  }

  public getTakingProfitsTransactions(): Array<Transaction> {
    return this.transactions.filter(tx => this.isUserTakingProfitsIn(tx));
  }

  public getTakingMintedTokensTransactions(): Array<Transaction> {
    return this.transactions.filter(tx => this.isUserTakingMintedTokensIn(tx));
  }

  public getHistory(): SmartContractHistory {
    let transactionsWithContract: Array<Transaction> = [];
    if (this.smartContract.isFarmingDifferentToken()) {
      transactionsWithContract = this.calculateUserHistoryWhenFarmingDifferentToken();
    } else if (this.smartContract.isAutoCompoundingStake()) {
      transactionsWithContract = this.calculateUserHistoryWhenCompoundingToken();
    } else if (this.smartContract.isFarmingDifferentTokenAndMinting()) {
      transactionsWithContract = this.calculateUserHistoryWhenFarmingDifferentTokenAndMinting();
    } else if (this.smartContract.isAutoCompoundingStakeAndMinting()) {
      transactionsWithContract = this.calculateUserHistoryWhenCompoundingTokenAndMinting();
    }
    return {
      transactions: transactionsWithContract,
      withdrawnProfit: transactionsWithContract.slice(-1).pop()?.getAccumulated()?.rewardedToken ?? '0',
      withdrawnMinted: transactionsWithContract.slice(-1).pop()?.getAccumulated()?.mintedToken ?? '0'
    };
  }

  private calculateUserHistoryWhenFarmingDifferentToken(): Array<Transaction> {
    let withdrawnRewardTokens = BigNumber.from(0.0);
    let depositedStakeTokens = BigNumber.from(0.0);

    return this.transactions.map(
      (tx: Transaction): Transaction => {
        const transferredTokens = BigNumber.from(tx.getValue());

        if (tx.isTransferOf(this.smartContract.getStakedToken())) {
          depositedStakeTokens = tx.isDepositOf(this.user.address)
            ? depositedStakeTokens.add(transferredTokens)
            : depositedStakeTokens.sub(transferredTokens);
        }

        if (this.isUserTakingProfitsIn(tx)) {
          withdrawnRewardTokens = withdrawnRewardTokens.add(transferredTokens);
        }
        tx.setAccumulated({
          stakedToken: depositedStakeTokens.toString(),
          rewardedToken: withdrawnRewardTokens.toString(),
          mintedToken: '0'
        });
        return tx;
      }
    );
  }

  private calculateUserHistoryWhenFarmingDifferentTokenAndMinting(): Array<Transaction> {
    let depositedStakeTokens = BigNumber.from(0.0);
    let withdrawnRewardTokens = BigNumber.from(0.0);
    let withdrawnMintedTokens = BigNumber.from(0.0);

    return this.transactions.map(
      (tx: Transaction): Transaction => {
        const transferredTokens = BigNumber.from(tx.getValue());

        if (tx.isTransferOf(this.smartContract.getStakedToken())) {
          depositedStakeTokens = tx.isDepositOf(this.user.address)
            ? depositedStakeTokens.add(transferredTokens)
            : depositedStakeTokens.sub(transferredTokens);
        }

        if (this.isUserTakingProfitsIn(tx)) {
          withdrawnRewardTokens = withdrawnRewardTokens.add(transferredTokens);
        }

        if (this.isUserTakingMintedTokensIn(tx)) {
          withdrawnMintedTokens = withdrawnMintedTokens.add(transferredTokens);
        }

        tx.setAccumulated({
          stakedToken: depositedStakeTokens.toString(),
          rewardedToken: withdrawnRewardTokens.toString(),
          mintedToken: withdrawnMintedTokens.toString()
        });
        return tx;
      }
    );
  }

  private calculateUserHistoryWhenCompoundingToken(): Array<Transaction> {
    let withdrawnRewardTokens = BigNumber.from(0.0);
    let depositedStakeTokens = BigNumber.from(0.0);

    return this.transactions.map(
      (tx: Transaction): Transaction => {
        const transferredTokens = BigNumber.from(tx.getValue());

        if (tx.isDepositOf(this.user.address)) {
          depositedStakeTokens = depositedStakeTokens.add(transferredTokens);
        } else if (tx.isWithdrawOf(this.user.address)) {
          if (transferredTokens.gt(depositedStakeTokens)) {
            const rewardTokens = transferredTokens.sub(depositedStakeTokens);
            depositedStakeTokens = BigNumber.from(0);
            withdrawnRewardTokens = withdrawnRewardTokens.add(rewardTokens);
          } else {
            depositedStakeTokens = depositedStakeTokens.sub(transferredTokens);
          }
        }
        tx.setAccumulated({
          stakedToken: depositedStakeTokens.toString(),
          rewardedToken: withdrawnRewardTokens.toString(),
          mintedToken: '0'
        });
        return tx;
      }
    );
  }

  private calculateUserHistoryWhenCompoundingTokenAndMinting(): Array<Transaction> {
    console.log(
      this.transactions.filter(
        tx => tx.hash.toString() === '0x64a6714206073079d6f8551974590633f8f35b682cd296440c87d8dd318d7738'
      ).length
    );
    let withdrawnRewardTokens = BigNumber.from(0.0);
    let depositedStakeTokens = BigNumber.from(0.0);
    let withdrawnMintedTokens = BigNumber.from(0.0);

    return this.transactions.map(
      (tx: Transaction): Transaction => {
        const transferredTokens = BigNumber.from(tx.getValue());

        if (tx.isDepositOf(this.user.address)) {
          depositedStakeTokens = depositedStakeTokens.add(transferredTokens);
        } else if (tx.isWithdrawOf(this.user.address)) {
          if (this.isUserTakingMintedTokensIn(tx)) {
            withdrawnMintedTokens = withdrawnMintedTokens.add(transferredTokens);
          }
          if (transferredTokens.gt(depositedStakeTokens)) {
            const rewardTokens = transferredTokens.sub(depositedStakeTokens);
            depositedStakeTokens = BigNumber.from(0);
            withdrawnRewardTokens = withdrawnRewardTokens.add(rewardTokens);
          } else {
            depositedStakeTokens = depositedStakeTokens.sub(transferredTokens);
          }
        }
        tx.setAccumulated({
          stakedToken: depositedStakeTokens.toString(),
          rewardedToken: withdrawnRewardTokens.toString(),
          mintedToken: withdrawnMintedTokens.toString()
        });
        return tx;
      }
    );
  }

  private isUserTakingProfitsIn(tx: Transaction): boolean {
    return tx.isTransferOf(this.smartContract.getRewardedToken()) && tx.isWithdrawOf(this.user.address);
  }

  private isUserTakingMintedTokensIn(tx: Transaction) {
    return tx.isTransferOf(this.smartContract.getMintedToken()) && tx.isWithdrawOf(this.user.address);
  }
}
