import { Command } from '../../../../Shared/domain/Command';

type Params = {
  id: string;
  address: string;
};

export class CreateUserCommand extends Command {
  id: string;
  address: string;

  constructor({ id, address }: Params) {
    super();
    this.id = id;
    this.address = address;
  }
}
