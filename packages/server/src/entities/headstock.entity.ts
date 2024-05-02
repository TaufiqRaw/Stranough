import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position, PositionWithRotation} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import { GuitarModel } from "./guitar-model.entity";

export type HeadstockProps = EntityWithoutBase<Headstock>;

@Entity()
export class Headstock extends BaseEntity {
  @Property()
  name : string;

  @Property()
  description : string;

  @ManyToOne(()=>GuitarModel, {deleteRule : 'set null', updateRule : 'cascade'})
  model ?: GuitarModel;

  @Property()
  price : number;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  texture ?: Media;

  @Property({type : 'float'})
  scale : number;

  @Property({type : 'json'})
  pivotPosition : Position;

  @Property({type : 'smallint'})
  stringCount : number;

  @Property({type : 'json'})
  pegsSpawnPoint : PositionWithRotation[];

  constructor(props : HeadstockProps){
    super();
    classAssign(this, props);
  }
}