import { Entity, ManyToOne, Property, Ref, ref } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position, PositionWithRotation} from "../interfaces/position.interface";
import { EntityWithSprite, EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import { GuitarModel } from "./guitar-model.entity";
import { maxDescriptionLength, mediaFKOption } from "../constants";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";

export interface HeadstockProps extends EntityWithSprite<Headstock> {}

@Entity()
export class Headstock extends BaseEntityWithSprite {
  @ManyToOne(()=>GuitarModel, {deleteRule : 'set null', updateRule : 'cascade'})
  model ?: GuitarModel;

  @Property({type : 'smallint'})
  stringCount : number;

  @Property({type : 'json'})
  pegsSpawnPoint : PositionWithRotation[];

  constructor(props : HeadstockProps){
    super();
    const {texture, thumbnail,..._props} = props;
    classAssign(this, _props);
    this.ctorMedias({texture, thumbnail});
  }

  async loadMedias(){
    await this.texture?.load();
    await this.thumbnail?.load();
  }
}