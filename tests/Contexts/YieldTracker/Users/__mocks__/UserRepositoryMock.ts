import { Nullable } from '../../../../../src/Contexts/Shared/domain/Nullable';
import { UserRepository } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/UserRepository';
import { UserId } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/UserId';
import { User } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/User';

export class UserRepositoryMock implements UserRepository {
  private mockSave = jest.fn();
  private mockSearch = jest.fn();

  async save(user: User): Promise<void> {
    this.mockSave(user);
  }

  expectLastSavedUserToBe(expectedUser: User): void {
    expect(this.mockSave).toBeCalledWith(expectedUser);
  }

  async search(id: UserId): Promise<Nullable<User>> {
    return this.mockSearch(id);
  }

  whenSearchThenReturn(value: Nullable<User>): void {
    this.mockSearch.mockReturnValueOnce(value);
  }

  expectLastSearchedUserTobe(expected: UserId): void {
    expect(this.mockSearch).toBeCalledWith(expected);
  }
}
