import { CourseId } from '../../../../../src/Contexts/Mooc/Shared/domain/Courses/CourseId';
import { Nullable } from '../../../../../src/Contexts/Shared/domain/Nullable';
import { UserRepository } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/UserRepository';
import { UserId } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/UserId';
import { User } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/User';

export class UserRepositoryMock implements UserRepository {
  private mockSave = jest.fn();
  private mockSearch = jest.fn();

  async save(course: User): Promise<void> {
    this.mockSave(course);
  }

  expectLastSavedUserToBe(expectedCourse: User): void {
    expect(this.mockSave).toBeCalledWith(expectedCourse);
  }

  async search(id: CourseId): Promise<Nullable<User>> {
    return this.mockSearch(id);
  }

  whenSearchThenReturn(value: Nullable<User>): void {
    this.mockSearch.mockReturnValueOnce(value);
  }

  expectLastSearchedUserTobe(expected: UserId): void {
    expect(this.mockSearch).toBeCalledWith(expected);
  }
}
