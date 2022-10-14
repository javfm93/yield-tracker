import { TokensHistoricalPricesRepository } from '../domain/tokens-historical-prices-repository';
import { Transaction } from '../domain/transaction';
import {
  PriceHistory,
  TokensPriceHistory
} from '../../../../apps/yield-tracker/frontend/src/app/pages/HomePage/slice/types';
import moment from 'moment';

export class LocalStorageTokensHistoricalPricesRepository implements TokensHistoricalPricesRepository {
  find(token: string, timestamp: string): string | null {
    const tokensPriceHistory: TokensPriceHistory = JSON.parse(localStorage.getItem('tokensPriceHistory') ?? '{}');
    const date = moment.unix(Number(timestamp)).format('DD-MM-YYYY');

    return tokensPriceHistory?.[token]?.[date];
  }

  save(transactions: Array<Transaction>): void {
    let tokensPriceHistory: TokensPriceHistory = JSON.parse(localStorage.getItem('tokensPriceHistory') ?? '{}');
    const dateFormat = 'DD-MM-YYYY';
    transactions
      .filter(tx => parseFloat(tx.getToken().getPrice()) > 0)
      .forEach(transaction => {
        const date = moment.unix(Number(transaction.getTimeStamp())).format(dateFormat);
        if (tokensPriceHistory[transaction.getToken().getSymbol()]?.[date]) return;
        const newTokenPriceHistory: PriceHistory = {
          ...tokensPriceHistory[transaction.getToken().getSymbol()],
          ...{ [date]: transaction.getToken().getPrice() }
        };
        tokensPriceHistory = {
          ...tokensPriceHistory,
          ...{ [transaction.getToken().getSymbol()]: newTokenPriceHistory }
        };
      });
    localStorage.setItem('tokensPriceHistory', JSON.stringify(tokensPriceHistory));
  }
}
