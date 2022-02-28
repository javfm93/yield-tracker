import { Nullable } from '../../../../Shared/domain/Nullable';
import { MongoRepository } from '../../../../Shared/infrastructure/persistence/mongo/MongoRepository';
import { UserTransactionsRepository } from '../../domain/UserTransactionsRepository';
import { TransactionHash } from '../../domain/TransactionHash';
import { User, UserProps } from '../../domain/User';

export class MongoUserRepository
  extends MongoRepository<User, UserProps>
  implements UserTransactionsRepository
{
  public save(user: User): Promise<void> {
    return this.persist(user.id.toString(), user);
  }

  public async search(id: TransactionHash): Promise<Nullable<User>> {
    const collection = await this.collection();
    const document = await collection.findOne({ _id: id.toString() });

    return document ? User.fromPrimitives({ ...document, id: id.toString() }) : null;
  }

  protected moduleName(): string {
    return 'courses';
  }
}
