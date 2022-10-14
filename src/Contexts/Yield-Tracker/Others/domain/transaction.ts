import { Token } from './token';
import { Address } from '../../../Shared/domain/Address';
import { HashEntity } from '../../../Shared/domain/HashEntity';
import { TransactionHash } from '../../UserSmartContracts/domain/TransactionHash';

export enum AccumulatedTypes {
  stakedToken = 'stakedToken',
  rewardedToken = 'rewardedToken',
  mintedToken = 'mintedToken'
}

export interface Accumulated {
  [AccumulatedTypes.stakedToken]: string;
  [AccumulatedTypes.rewardedToken]: string;
  [AccumulatedTypes.mintedToken]: string;
}

export interface CreateTransactionProps {
  from: Address;
  to: Address;
  value: string;
  token: Token;
  timeStamp: string;
}

export interface DefaultTransactionProps {
  accumulated?: Accumulated;
  input?: string;
}

export interface TransactionProps extends CreateTransactionProps, DefaultTransactionProps {}

export class Transaction extends HashEntity<TransactionProps> {
  private constructor(hash: TransactionHash, props: TransactionProps) {
    super(hash, props);
  }

  public static create(hash: TransactionHash, props: CreateTransactionProps) {
    return new Transaction(hash, props);
  }

  isDepositOf(address: Address): boolean {
    return this.props.from.isEqualTo(address);
  }

  isWithdrawOf(address: Address): boolean {
    return this.props.to.isEqualTo(address);
  }

  isTransferOf(token?: Token | string): boolean {
    return typeof token === 'string'
      ? this.props.token.getSymbol() === token
      : this.props.token.isEqualTo(token);
  }

  isAtTheSameTimeThan(transaction: Transaction) {
    return this.props.timeStamp === transaction.getTimeStamp();
  }

  inputIncludes(token: Token) {
    return this.props.input?.includes(token.address.toString());
  }

  getToken(): Token {
    return this.props.token;
  }

  getTimeStamp(): string {
    return this.props.timeStamp;
  }

  getInput(): string {
    return this.props.input ?? '';
  }

  getValue(): string {
    return this.props.value;
  }

  // todo: we could define a default value for this
  getAccumulated(): Accumulated | undefined {
    return this.props.accumulated;
  }

  setInput(input: string) {
    this.props.input = input;
  }

  setToken(token: Token) {
    this.props.token = token;
  }

  setAccumulated(accumulated: Accumulated) {
    this.props.accumulated = accumulated;
  }
}
