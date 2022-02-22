import { Hash } from './hash';

const isEntity = (v: any): v is HashEntity<any> => {
  return v instanceof HashEntity;
};

export abstract class HashEntity<T> {
  readonly hash: Hash;
  public readonly props: T;

  constructor(hash: string, props: T) {
    this.hash = Hash.create(hash);
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
