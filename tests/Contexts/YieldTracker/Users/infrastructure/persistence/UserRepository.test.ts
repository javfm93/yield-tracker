import { UserGenerator } from '../../domain/UserGenerator';
import { UserRepository } from '../../../../../../src/Contexts/Yield-Tracker/Users/domain/UserRepository';
import container from '../../../../../../src/apps/yield-tracker/backend/dependency-injection';
import { EnvironmentArranger } from '../../../../Shared/infrastructure/arranger/EnvironmentArranger';

const repository: UserRepository = container.get('YieldTracker.users.UserRepository');
const environmentArranger: Promise<EnvironmentArranger> = container.get('YieldTracker.EnvironmentArranger');

beforeEach(async () => {
  await (await environmentArranger).arrange();
});

afterAll(async () => {
  await (await environmentArranger).arrange();
  await (await environmentArranger).close();
});

describe('UserRepository', () => {
  describe('#save', () => {
    it('should save a user', async () => {
      const user = UserGenerator.random();

      await repository.save(user);
    });
  });

  describe('#search', () => {
    it('should return an existing user', async () => {
      const expectedUser = UserGenerator.random();
      await repository.save(expectedUser);

      const user = await repository.search(expectedUser.id);

      expect(expectedUser.toPrimitives()).toEqual(user?.toPrimitives());
    });

    it('should not return a non existing user', async () => {
      expect(await repository.search(UserGenerator.random().id)).toBeNull();
    });
  });
});
