import { ExternalProvider } from '@ethersproject/providers/src.ts/web3-provider';
import { Effect, SimpleEffect } from 'redux-saga/effects';
import { Transaction } from '../../../../modules/smartContract/domain/transaction';
import { AvailableTokens, Token } from '../../../../modules/smartContract/domain/token';
import { Address } from '../../../../modules/shared/domain/address';

interface Web3Provider extends ExternalProvider {
  enable: () => Promise<Array<string>>;
}
declare global {
  interface Window {
    ethereum: Web3Provider;
  }
}

export interface HomePageState {
  userPlatformsState?: UserPlatformsState;
  loading: boolean;
  error?: HomePageErrorType;
}

export type TokensPrice = {
  [key in AvailableTokens]: string;
};

export enum HomePageErrorType {
  RESPONSE_ERROR = 1,
}

export interface CoingeckoTokensCurrentPriceResponse {
  binancecoin: CoingeckoUsdPrice;
  'pancake-bunny': CoingeckoUsdPrice;
  cake: CoingeckoUsdPrice;
  acryptos: CoingeckoUsdPrice;
}

export interface CoingeckoUsdPrice {
  usd: string;
}

export interface TokensPriceHistory {
  BUNNY: PriceHistory;
  WBNB: PriceHistory;
}

export interface PriceHistory {
  [key: string]: number;
}

export interface CoingeckoTokenHistoryResponse {
  id: string;
  symbol: string;
  name: string;
  image: {
    thumb: string;
    small: string;
  };
  market_data: {
    current_price: {
      usd: number;
    };
  };
}

export interface BscScanTransaction {
  hash: string;
  from: string;
  to: string;
  contractAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: string;
  value: string;
  timeStamp: string;
}
export interface BscScanAddressTransactionsResponse {
  status: string;
  message: string;
  result: Array<BscScanTransaction>;
}

export interface BscScanTransactionInputResponse {
  result: {
    input: string;
  };
}

/** Strip any saga effects from a type; this is typically useful to get the return type of a saga. */
type StripEffects<T> = T extends IterableIterator<infer E>
  ? E extends Effect | SimpleEffect<any, any>
    ? never
    : E
  : never;

/** Unwrap the type to be consistent with the runtime behavior of a call. */
type DecideReturn<T> = T extends Promise<infer R>
  ? R // If it's a promise, return the promised type.
  : T extends IterableIterator<any>
  ? StripEffects<T> // If it's a generator, strip any effects to get the return type.
  : T; // Otherwise, it's a normal function and the return type is unaffected.

/** Determine the return type of yielding a call effect to the provided function.
 *
 * Usage: const foo: CallReturnType&lt;typeof func&gt; = yield call(func, ...)
 */
export type CallReturns<T extends (...args: any[]) => any> = DecideReturn<ReturnType<T>>;

export type ContainerState = HomePageState;

export interface SmartContractHistory {
  transactions: Array<Transaction>;
  withdrawnProfit: string;
  withdrawnMinted: string;
}

export interface GlobalState {
  totalCurrentBalance: string;
  totalUnrealizedProfit: string;
  totalRealizedProfit: string;
}

export interface UserPlatformsState extends GlobalState {
  platforms: Array<UserSmartContractsPlatform>;
}

export interface UserSmartContractsPlatform {
  name: 'Acryptos' | 'Pancake-bunny';
  smartContractsState: Array<UserSmartContractState>;
}

export interface UserSmartContractState {
  address: string;
  stakedToken: string;
  stakedTokenIcon: string;
  rewardedToken: string;
  rewardedTokenIcon: string;
  mintedToken?: string;
  mintedTokenIcon?: string;
  mintedTokenPrice?: string;
  apr: string;
  tvl: string;
  price: string;
  balance: string;
  totalValue: string;
  profit: string;
  profitPrice: string;
  profitsValue: string;
  contractHistory: SmartContractHistory;
}
