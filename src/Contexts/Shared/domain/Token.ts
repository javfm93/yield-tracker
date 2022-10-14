import { AddressEntity } from './addressEntity';
import { TokenAddress } from './TokenAddress';

export interface PriceHistory {
  [key: string]: number;
}

export enum AvailableTokens {
  BUNNY = 'BUNNY',
  WBNB = 'WBNB',
  CAKE = 'Cake',
  CAKE_LP = 'Cake-LP',
  ACS = 'ACS',
  // BTC = "BTC"
  NOOP = 'noop'
}
const tokenIcons: Record<AvailableTokens, string> = {
  [AvailableTokens.NOOP]: '',
  [AvailableTokens.BUNNY]:
    'https://assets.coingecko.com/coins/images/13148/large/wallet-logo-bunny.png?1621840208',
  [AvailableTokens.WBNB]:
    'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png?1547034615',
  [AvailableTokens.CAKE]:
    'https://assets.coingecko.com/coins/images/12632/large/IMG_0440.PNG?1602654093',
  [AvailableTokens.ACS]:
    'https://assets.coingecko.com/coins/images/13276/large/favicon-200x200.png?1606894442',
  [AvailableTokens.CAKE_LP]: ''
};

export interface TokenProps {
  symbol: AvailableTokens;
  icon?: string;
  price?: string;
  priceHistory?: PriceHistory;
}

export class Token extends AddressEntity<TokenProps> {
  private constructor(address: TokenAddress, props: TokenProps) {
    super(address, props);
  }

  public static create(address: TokenAddress, props: TokenProps) {
    // const suffixErrorMessage = '[Domain:Token]';

    const defaultProps = {
      price: '0',
      icon: Object.values(AvailableTokens).includes(props.symbol)
        ? tokenIcons[props.symbol]
        : tokenIcons[AvailableTokens.NOOP]
    };

    // if (!Object.values(AvailableTokens).includes(props.symbol)) {
    //   throw Error(`${suffixErrorMessage}: Not valid token symbol`);
    // }

    return new Token(address, { ...defaultProps, ...props });
  }

  getSymbol(): AvailableTokens {
    return this.props.symbol;
  }

  getPrice(): string {
    return this.props.price ?? '0';
  }

  setPrice(price: string) {
    this.props.price = price;
  }

  getIcon(): string {
    return this.props.icon ?? tokenIcons.noop;
  }
}
