import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { idProperty } from "../utils/id-property.util";
import { Media } from "./media.entity";

export type KnobProps = EntityWithoutBase<Knob>;

@Entity()
export class Knob extends BaseEntity {
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

  constructor(props : KnobProps){
    super();
    classAssign(this, props);
  }
}