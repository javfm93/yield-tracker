import { UserAddressGenerator } from './UserAddressGenerator';
import { User } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/User';
import { UserIdGenerator } from './UserIdGenerator';

describe('Course', () => {
  it('should record a CourseCreatedDomainEvent after its creation', () => {
    const course = User.create(UserIdGenerator.random(), { address: UserAddressGenerator.random(), transactions: [] });

    const events = course.pullDomainEvents();

    expect(events).toHaveLength(1);
    expect(events[0].eventName).toBe('user.created');
  });
});
