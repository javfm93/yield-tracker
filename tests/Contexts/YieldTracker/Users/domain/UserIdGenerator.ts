import { UserId } from '../../../../../src/Contexts/Yield-Tracker/Users/domain/UserId';
import { UuidGenerator } from '../../../Shared/domain/UuidGenerator';

export class UserIdGenerator {
  static create(value: string): UserId {
    return UserId.create(value);
  }

  static random(): UserId {
    return this.create(UuidGenerator.random().toString());
  }
}
