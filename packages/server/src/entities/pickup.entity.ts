import { Entity, Enum, Index, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithSprite, EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import * as Enums from "../enums";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";
import {Pickup as PickupConfig} from 'stranough-common'

export type PickupProps = EntityWithSprite<Pickup>;

@Entity()
// @Index({ name: 'pickup_hnsw_l2_idx', expression: 'CREATE INDEX "pickup_hnsw_l2_idx" ON "pickup" USING hnsw (embedding vector_l2_ops)' })
export class Pickup extends BaseEntityWithSprite {

  @Enum(()=>PickupConfig.PickupType)
  type : PickupConfig.PickupType;

  @Property()
  stringCount : number;

  constructor(props : PickupProps){
    super();
    const {thumbnail, texture, ..._props} = props;
    classAssign(this, _props);
    this.ctorMedias({thumbnail, texture});
  }
}