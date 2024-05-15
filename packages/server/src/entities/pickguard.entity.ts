import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { GuitarModel } from "./guitar-model.entity";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import { maxDescriptionLength } from "../constants";

export type PickguardProps = EntityWithoutBase<Pickguard>;

@Entity()
export class Pickguard extends BaseEntity {
  @Property()
  name : string;

  @Property({type : 'varchar', length : maxDescriptionLength})
  description : string;

  @Property()
  price : number;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  texture ?: Media;

  @Property({type : 'float'})
  scale : number;

  @Property({type : 'json'})
  pivotPosition : Position;

  @ManyToOne(()=>GuitarModel)
  model : GuitarModel;

  constructor(props : PickguardProps){
    super();
    classAssign(this, props);
  }
}