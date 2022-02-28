import { Hash } from './Hash';

const isEntity = (v: any): v is HashEntity<any> => v instanceof HashEntity;

export abstract class HashEntity<T> {
  readonly hash: Hash;
  protected props: T;

  protected constructor(hash: Hash, props: T) {
    this.hash = hash;
    this.props = props;
  }

  public isEqualTo(entity?: HashEntity<T>): boolean {
    if (!entity) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    if (!isEntity(entity)) {
      return false;
    }

    return this.hash.isEqualTo(entity.hash);
  }
}
