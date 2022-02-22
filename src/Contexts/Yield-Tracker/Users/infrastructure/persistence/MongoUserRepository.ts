import { Nullable } from '../../../../Shared/domain/Nullable';
import { MongoRepository } from '../../../../Shared/infrastructure/persistence/mongo/MongoRepository';
import { UserRepository } from '../../domain/UserRepository';
import { UserId } from '../../domain/UserId';
import { User, UserProps } from '../../domain/User';

export class MongoUserRepository extends MongoRepository<User, UserProps> implements UserRepository {
  public save(user: User): Promise<void> {
    return this.persist(user.id.toString(), user);
  }

  public async search(id: UserId): Promise<Nullable<User>> {
    const collection = await this.collection();
    const document = await collection.findOne({ _id: id.toString() });

    return document ? User.fromPrimitives({ ...document, id: id.toString() }) : null;
  }

  protected moduleName(): string {
    return 'courses';
  }
}
