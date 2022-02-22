import { CreateUserCommand } from '../../../../../src/Contexts/Yield-Tracker/Users/application/Create/CreateUserCommand';
import { UuidGenerator } from '../../../Shared/domain/UuidGenerator';
import { AddressGenerator } from '../../../Shared/domain/AddressGenerator';

export class CreateUserCommandGenerator {
  static create(id: string, address: string): CreateUserCommand {
    return new CreateUserCommand({ id, address });
  }

  static random(): CreateUserCommand {
    return this.create(UuidGenerator.random().toString(), AddressGenerator.random().toString());
  }
}
