import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";

export type BridgeProps = EntityWithoutBase<Bridge>;

@Entity()
export class Bridge extends BaseEntityWithSprite{

  @Property({type : 'smallint'})
  stringCount : number;

  @Property({type : 'json'})
  stringSpawnPoint : Position[];

  constructor(props : BridgeProps){
    super();
    classAssign(this, props);
  }
}