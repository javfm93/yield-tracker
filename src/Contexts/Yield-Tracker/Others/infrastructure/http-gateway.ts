import axios from 'axios';
import { Transaction } from '../domain/transaction';
import moment from 'moment';
import { Gateway } from '../domain/gateway';
import { AvailableTokens, Token } from '../domain/token';
import { Address } from '../../../Shared/domain/address';
import {
  TokensPriceHistory,
  BscScanAddressTransactionsResponse,
  BscScanTransaction,
  BscScanTransactionInputResponse,
  CoingeckoTokenHistoryResponse,
  CoingeckoTokensCurrentPriceResponse,
  TokensPrice
} from '../../../../apps/yield-tracker/frontend/src/app/pages/HomePage/slice/types';

const transactionsMapper = (bscTransactions: Array<BscScanTransaction>): Array<Transaction> =>
  bscTransactions.map(tx =>
    Transaction.create(tx.hash, {
      from: Address.create(tx.from),
      to: Address.create(tx.to),
      value: tx.value,
      token: Token.create(tx.contractAddress, { symbol: tx.tokenSymbol as AvailableTokens }),
      timeStamp: tx.timeStamp
    })
  );
const coingeckoIdOf = {
  BUNNY: 'pancake-bunny',
  WBNB: 'binancecoin',
  Cake: 'pancakeswap-token',
  ACS: 'acryptos'
};

interface TransactionsInput {
  transactionsInput: Array<TransactionInput>;
}

interface TransactionInput {
  [transactionHash: string]: string;
}

export class HttpGateway implements Gateway {
  private cachedTokenPrices: TokensPrice | undefined;

  async transactionsOf(address: string): Promise<Array<Transaction>> {
    try {
      const requestURL = `https://api.bscscan.com/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=QICNEGB83JH4H2ASFEGH7FYQ1IH4BDXVZR`;
      const { data } = await axios.get<BscScanAddressTransactionsResponse>(requestURL);
      return transactionsMapper(data.result);
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  async getInputOf(transaction: Transaction): Promise<string> {
    const transactionsInput: TransactionsInput = JSON.parse(localStorage.getItem('transactionsInput') ?? '{}');
    const { hash: transactionHash } = transaction;

    if (transactionsInput[transactionHash.toString()]) {
      return transactionsInput[transactionHash.toString()];
    } else {
      try {
        const requestURL = `https://api.bscscan.com/api?module=proxy&action=eth_getTransactionByHash&txhash=${transactionHash}&apikey=QICNEGB83JH4H2ASFEGH7FYQ1IH4BDXVZR`;
        const { data } = await axios.get<BscScanTransactionInputResponse>(requestURL);
        const { input } = data.result;
        return input ? '0x' + input.substring(input.length - 40) : '';
      } catch (e) {
        console.log(e);
        return '';
      }
    }
    // tx hash that returns acs 0x64a6714206073079d6f8551974590633f8f35b682cd296440c87d8dd318d7738
  }
  // todo: here only the request, the logic should to a service
  async getTokenPriceAt(token: Token, timestamp: string): Promise<string> {
    if (!coingeckoIdOf[token.getSymbol()]) return '0';
    const tokensPriceHistory: TokensPriceHistory = JSON.parse(localStorage.getItem('tokensPriceHistory') ?? '{}');
    const date = moment.unix(Number(timestamp)).format('DD-MM-YYYY');

    if (!tokensPriceHistory?.[token.getSymbol()]?.[date]) {
      try {
        const tokenId = coingeckoIdOf[token.getSymbol()];
        const requestURL = `https://api.coingecko.com/api/v3/coins/${tokenId}/history?date=${date}`;
        const { data } = await axios.get<CoingeckoTokenHistoryResponse>(requestURL);
        return data.market_data.current_price.usd.toString();
      } catch (e) {
        console.log(e);
        return '0';
      }
    } else {
      return tokensPriceHistory[token.getSymbol()][date];
    }
  }

  async getCurrentTokensPrice(): Promise<TokensPrice> {
    try {
      if (this.cachedTokenPrices) return this.cachedTokenPrices;
      const tokens = Object.values(coingeckoIdOf).join(',');
      const requestURL = `https://api.coingecko.com/api/v3/simple/price?ids=${tokens}&vs_currencies=usd`;
      const { data } = await axios.get<CoingeckoTokensCurrentPriceResponse>(requestURL);
      this.cachedTokenPrices = {
        [AvailableTokens.WBNB]: data.binancecoin.usd,
        [AvailableTokens.BUNNY]: data['pancake-bunny'].usd,
        [AvailableTokens.CAKE]: data['pancakeswap-token'].usd,
        [AvailableTokens.CAKE_LP]: '0',
        [AvailableTokens.ACS]: data['acryptos'].usd,
        [AvailableTokens.NOOP]: '0'
      };
      return this.cachedTokenPrices;
    } catch (e) {
      console.log(e);
      return {
        [AvailableTokens.WBNB]: '0',
        [AvailableTokens.BUNNY]: '0',
        [AvailableTokens.CAKE]: '0',
        [AvailableTokens.CAKE_LP]: '0',
        [AvailableTokens.ACS]: '0',
        [AvailableTokens.NOOP]: '0'
      };
    }
  }
}
