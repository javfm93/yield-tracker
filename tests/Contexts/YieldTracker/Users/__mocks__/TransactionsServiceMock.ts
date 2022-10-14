import { TransactionsService } from '../../../../../src/Contexts/Yield-Tracker/UserSmartContracts/domain/TransactionsService';
import { Transaction } from '../../../../../src/Contexts/Yield-Tracker/UserSmartContracts/domain/Transaction';
import { Address } from '../../../../../src/Contexts/Shared/domain/Address';

export class TransactionsServiceMock implements TransactionsService {
  private mockTransactionsOf = jest.fn();
  private mockGetInputOf = jest.fn();

  constructor(expectedTransactions: Array<Transaction>) {
    this.mockTransactionsOf.mockResolvedValueOnce(expectedTransactions);
  }
  async getTransactionsOf(address: Address): Promise<Transaction[]> {
    return this.mockTransactionsOf(address);
  }

  expectGetTransactionsToBeCalledWith(address: Address): void {
    expect(this.mockTransactionsOf).toBeCalledWith(address);
  }

  async getInputOf(transaction: Transaction): Promise<string> {
    return this.mockGetInputOf(transaction);
  }

  expectGetInputToBeCalledWith(transaction: Transaction): void {
    expect(this.mockGetInputOf).toBeCalledWith(transaction);
  }
}
