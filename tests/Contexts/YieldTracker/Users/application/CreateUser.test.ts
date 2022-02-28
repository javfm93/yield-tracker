import { UserRepositoryMock } from '../__mocks__/UserRepositoryMock';
import { CreateUserCommandGenerator } from './CreateUserCommandGenerator';
import EventBusMock from '../__mocks__/EventBusMock';
import { CreateUserCommandHandler } from '../../../../../src/Contexts/Yield-Tracker/Users/application/Create/CreateUserCommandHandler';
import { CreateUser } from '../../../../../src/Contexts/Yield-Tracker/Users/application/Create/CreateUser';
import { UserGenerator } from '../domain/UserGenerator';
import { TransactionsServiceMock } from '../__mocks__/TransactionsServiceMock';
import { TransactionGenerator } from '../domain/TransactionGenerator';

describe('Application/Handler/CreateUser', () => {
  const repository = new UserRepositoryMock();
  const eventBus = new EventBusMock();
  const expectedTransactions = TransactionGenerator.randomBulk();
  const transactionsService = new TransactionsServiceMock(expectedTransactions);
  const creator = new CreateUser(repository, eventBus, transactionsService);
  const handler = new CreateUserCommandHandler(creator);

  it('should create a valid user with the list of transactions of that address', async () => {
    const command = CreateUserCommandGenerator.random();

    await handler.handle(command);

    const user = UserGenerator.fromCommand(command, expectedTransactions);
    const events = user.pullDomainEvents();
    repository.expectLastSavedUserToBe(user);
    expect(events).toHaveLength(1);
    eventBus.expectLastPublishedEventToBe(events[0]);
  });
});
