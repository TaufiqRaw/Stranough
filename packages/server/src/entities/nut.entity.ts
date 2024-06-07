import { Entity, Index, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithSprite, EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";

export type NutProps = EntityWithSprite<Nut>;

@Entity()
@Index({ name: 'nut_hnsw_l2_idx', expression: 'CREATE INDEX "nut_hnsw_l2_idx" ON "nut" USING hnsw (embedding vector_l2_ops)' })
export class Nut extends BaseEntityWithSprite {

  @Property({type : 'smallint'})
  stringCount : number;

  @Property({type : 'json'})
  stringSpawnPoint : Position[];

  constructor(props : NutProps){
    super();
    const {thumbnail, texture, ..._props} = props;
    classAssign(this, _props);
    this.ctorMedias({thumbnail, texture});
  }
}