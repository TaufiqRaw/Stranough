import { PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/postgresql';
import { idProperty } from '../utils/id-property.util';

export abstract class BaseEntity {

  @PrimaryKey({autoincrement : true, ...idProperty})
  id!: number;

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

}