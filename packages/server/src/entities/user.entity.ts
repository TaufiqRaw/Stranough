import { Collection, Entity, Index, ManyToOne, OneToMany, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithSprite, EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { GuitarBuilder } from "stranough-common";
import { Order } from "./order.entity";

export type UserProps = Omit<EntityWithoutBase<User>, 'orders' | 'isAdmin'> & {
  isAdmin ?: boolean;
};

@Entity()
// @Index({ name: 'nut_hnsw_l2_idx', expression: 'CREATE INDEX "nut_hnsw_l2_idx" ON "nut" USING hnsw (embedding vector_l2_ops)' })
export class User extends BaseEntity {

  @Property({
    length : 50
  })
  @Unique()
  username : string;

  @Property()
  password : string;

  @Property()
  @Unique()
  email : string;

  @Property()
  refreshToken ?: string;

  @Property()
  isAdmin : boolean = false;

  @OneToMany(()=>Order, order => order.createdBy)
  orders = new Collection<Order>(this);
  
  constructor(props : UserProps){
    super();
    classAssign(this, props);
  }
}