import { AvailableTokens, Token } from './token';
import { AddressEntity } from '../../../Shared/domain/addressEntity';
import { SmartContractType } from './smart-contract-type';
import { Address } from '../../../Shared/domain/Address';
import { Transaction } from './transaction';

export type TokensPrice = {
  [key in AvailableTokens]: string;
};

export enum AvailableSmartContractsAddress {
  BUNNY = '0xcadc8cb26c8c7cb46500e61171b5f27e9bd7889d',
  CAKE = '0xedfcb78e73f7ba6ad2d829bf5d462a0924da28ed',
  BUNNY_BNB_FLIP_BOOST = '0x69ff781cf86d42af9bf93c06b8be0f16a2905cbc',
  ACRYPTOS_BTC_BUSD = '0xbe627707f079e32a54d323be0c61da02a28bd0bd'
}

export interface SmartContractHistory {
  transactions: Array<Transaction>;
  withdrawnProfit: string;
  withdrawnMinted: string;
}
export enum AvailablePlatforms {
  BUNNY = 'BUNNY',
  ACRYPTOS = 'ACRYPTOS'
}

export interface SmartContractProps {
  platform: AvailablePlatforms;
  apr: string;
  tvl: string;
  stakedToken: Token;
  rewardedToken: Token;
  userBalance: string;
  userProfit: string;
  type: SmartContractType;
  userHistory: SmartContractHistory;
  mintedToken: Token;
  minterAddress: Address;
}

interface CreateSmartContractProps {
  platform: AvailablePlatforms;
  apr: string;
  tvl: string;
  stakedToken: Token;
  rewardedToken: Token;
  userBalance: string;
  userProfit: string;
  type: SmartContractType;
  userHistory?: SmartContractHistory;
  mintedToken?: Token;
  minterAddress?: Address;
}

interface DefaultSmartContractProps {
  userHistory: SmartContractHistory;
  mintedToken: Token;
  minterAddress: Address;
}

export class SmartContract extends AddressEntity<SmartContractProps> {
  private constructor(address: string, props: SmartContractProps) {
    super(address, props);
  }

  public static create(address: AvailableSmartContractsAddress, props: CreateSmartContractProps) {
    const suffixErrorMessage = '[Domain:SmartContract]';
    const defaultAddress = '0x0000000000000000000000000000000000000000';

    const defaultProps: DefaultSmartContractProps = {
      userHistory: { transactions: [], withdrawnProfit: '0', withdrawnMinted: '0' },
      mintedToken: Token.create(defaultAddress, { symbol: AvailableTokens.NOOP }),
      minterAddress: Address.create(defaultAddress)
    };

    if (!Object.values(AvailableSmartContractsAddress).includes(address)) {
      throw Error(`${suffixErrorMessage}: Not valid smart-contract address`);
    }

    if (props.type.isMinting()) {
      if (!props.minterAddress || !props.mintedToken) {
        throw Error(
          `${suffixErrorMessage}: Given the type minterAddress and mintedToken should exist`
        );
      }
    }

    return new SmartContract(address, { ...defaultProps, ...props });
  }

  public isAutoCompoundingStake(): boolean {
    return this.props.type.isAutoCompoundingStake();
  }

  public isAutoCompoundingStakeAndMinting(): boolean {
    return this.props.type.isAutoCompoundingStakeAndMinting();
  }

  public isFarmingDifferentToken(): boolean {
    return this.props.type.isFarmingDifferentToken();
  }

  public isFarmingDifferentTokenAndMinting(): boolean {
    return this.props.type.isFarmingDifferentTokenAndMinting();
  }

  public isMinting(): boolean {
    return this.props.type.isMinting();
  }

  public addTokensPrice(tokensPrice: TokensPrice) {
    this.props.stakedToken.setPrice(tokensPrice[this.getStakedToken().getSymbol()]);
    this.props.rewardedToken.setPrice(tokensPrice[this.getRewardedToken().getSymbol()]);
    if (this.isMinting() && this.props.mintedToken) {
      this.props.mintedToken.setPrice(tokensPrice[this.props.mintedToken.getSymbol()]);
    }
  }

  getStakedToken() {
    return this.props.stakedToken;
  }

  getRewardedToken() {
    return this.props.rewardedToken;
  }

  getMintedToken() {
    return this.props.mintedToken;
  }

  getApr() {
    return this.props.apr;
  }

  getTvl() {
    return this.props.tvl;
  }

  getUserBalance() {
    return this.props.userBalance;
  }

  getUserProfit() {
    return this.props.userProfit;
  }

  getMinterAddress() {
    return this.props.minterAddress;
  }

  getUserHistory(): SmartContractHistory {
    return this.props.userHistory;
  }

  getPlatform(): AvailablePlatforms {
    return this.props.platform;
  }

  setUserHistory(userHistory: SmartContractHistory) {
    this.props.userHistory = userHistory;
  }
}
