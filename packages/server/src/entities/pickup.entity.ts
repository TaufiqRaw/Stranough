import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import * as Enums from "../enums";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";

export type PickupProps = EntityWithoutBase<Pickup>;

@Entity()
export class Pickup extends BaseEntityWithSprite {

  @Enum(()=>Enums.GuitarPickupType)
  type : Enums.GuitarPickupType;

  constructor(props : PickupProps){
    super();
    classAssign(this, props);
  }
}