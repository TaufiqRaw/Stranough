import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import { GuitarPickupTypeEnum } from "../enums";

export type PickupProps = EntityWithoutBase<Pickup>;

@Entity()
export class Pickup extends BaseEntity {
  @Property()
  name : string;

  @Property()
  description : string;

  @Property()
  price : number;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  texture ?: Media;

  @Property({type : 'float'})
  scale : number;

  @Property({type : 'json'})
  pivotPosition : Position;

  @Enum(()=>GuitarPickupTypeEnum)
  type : GuitarPickupTypeEnum;

  constructor(props : PickupProps){
    super();
    classAssign(this, props);
  }
}