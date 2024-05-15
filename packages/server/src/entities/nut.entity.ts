import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";

export type NutProps = EntityWithoutBase<Nut>;

@Entity()
export class Nut extends BaseEntityWithSprite {

  @Property({type : 'smallint'})
  stringCount : number;

  @Property({type : 'json'})
  stringSpawnPoint : Position[];

  constructor(props : NutProps){
    super();
    classAssign(this, props);
  }
}