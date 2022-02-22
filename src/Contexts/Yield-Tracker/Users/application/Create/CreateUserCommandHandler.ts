import { CommandHandler } from '../../../../Shared/domain/CommandHandler';
import { CreateUserCommand } from './CreateUserCommand';
import { CreateUser } from './CreateUser';
import { Command } from '../../../../Shared/domain/Command';
import { UserId } from '../../domain/UserId';
import { UserAddress } from '../../domain/UserAddress';

export class CreateUserCommandHandler implements CommandHandler<CreateUserCommand> {
  constructor(private createUser: CreateUser) {}

  subscribedTo(): Command {
    return CreateUserCommand;
  }

  async handle(command: CreateUserCommand): Promise<void> {
    const id = UserId.create(command.id);
    const address = UserAddress.create(command.address);
    await this.createUser.execute({ id, address });
  }
}
