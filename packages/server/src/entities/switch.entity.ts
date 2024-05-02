import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";

export type SwitchProps = EntityWithoutBase<Switch>;

@Entity()
export class Switch extends BaseEntity {
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

  constructor(props : SwitchProps){
    super();
    classAssign(this, props);
  }
}