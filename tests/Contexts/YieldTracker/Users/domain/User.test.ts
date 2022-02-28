import { UserAddressGenerator } from './UserAddressGenerator';
import { User } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/User';
import { UserIdGenerator } from './UserIdGenerator';
import { UserTransactions } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/UserTransactions';
import { TransactionGenerator } from './TransactionGenerator';

describe('[Domain] User', () => {
  it('should record a CourseCreatedDomainEvent after its creation', () => {
    const course = User.create(UserIdGenerator.random(), {
      address: UserAddressGenerator.random(),
      transactions: UserTransactions.create(TransactionGenerator.randomBulk())
    });

    const events = course.pullDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('user.created');
  });
});
