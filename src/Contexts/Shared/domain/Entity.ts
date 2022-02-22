import { Uuid } from './value-object/Uuid';

const isEntity = (v: any): v is Entity<any> => v instanceof Entity;

export abstract class Entity<T> {
  readonly id: Uuid;
  protected props: T;

  protected constructor(id: Uuid, props: T) {
    this.id = id;
    this.props = props;
  }

  public isEqualTo(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!isEntity(object)) {
      return false;
    }

    return this.id.isEqualTo(object.id);
  }
}
