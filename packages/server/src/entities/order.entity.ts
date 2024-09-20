import { Entity, Index, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithSprite, EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { GuitarBuilder } from "stranough-common";
import { IUserChatContext } from "../interfaces/user-chat-context";
import { User } from "./user.entity";

export type OrderProps = EntityWithoutBase<Order>;

@Entity()
// @Index({ name: 'nut_hnsw_l2_idx', expression: 'CREATE INDEX "nut_hnsw_l2_idx" ON "nut" USING hnsw (embedding vector_l2_ops)' })
export class Order extends BaseEntity {

  @Property({type : 'json'})
  selectedItems : GuitarBuilder.SelectedItem;

  @Property({type : 'json'})
  selectedItemNames ?: IUserChatContext['selectedComponentName'];

  @Property()
  preferencesDescription ?: string;

  @Property()
  preferencesImgLength ?: number;

  @Property()
  oldId ?: string;

  @Property({length : 100})
  lastStep ?: string;

  @Property()
  isFinished : boolean = false;

  @ManyToOne(()=>User)
  createdBy : User;
  
  constructor(props : OrderProps){
    super();
    classAssign(this, props);
  }
}