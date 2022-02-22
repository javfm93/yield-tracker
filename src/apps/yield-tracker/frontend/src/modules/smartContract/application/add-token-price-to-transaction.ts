import { Gateway } from '../domain/gateway';
import { Transaction } from '../domain/transaction';
import { Token } from '../domain/token';

export class AddTokenPriceToTransaction {
  constructor(private api: Gateway) {}

  public async execute(tx: Transaction): Promise<Transaction> {
    const price = await this.api.getTokenPriceAt(tx.getToken(), tx.getTimeStamp());
    tx.setToken(Token.create(tx.getToken().address.toString(), { symbol: tx.getToken().getSymbol(), price: price }));
    return tx;
  }
}
