import { Entity, Index, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithSprite, EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { idProperty } from "../utils/id-property.util";
import { Media } from "./media.entity";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";

export type JackProps = EntityWithSprite<Jack>;

@Entity()
@Index({ name: 'jack_hnsw_l2_idx', expression: 'CREATE INDEX "jack_hnsw_l2_idx" ON "jack" USING hnsw (embedding vector_l2_ops)' })
export class Jack extends BaseEntityWithSprite {

  @Property()
  isSide : boolean;

  constructor(props : JackProps ){
    super();

    const {thumbnail, texture, ..._props} = props;
    classAssign(this, _props);
    this.ctorMedias({thumbnail, texture});
  }
}