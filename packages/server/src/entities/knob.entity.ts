import { Entity, Index, ManyToOne, Property } from "@mikro-orm/core";
import { EntityWithSprite, EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";

export type KnobProps = EntityWithSprite<Knob>;

@Entity()
@Index({ name: 'knob_hnsw_l2_idx', expression: 'CREATE INDEX "knob_hnsw_l2_idx" ON "knob" USING hnsw (embedding vector_l2_ops)' })
export class Knob extends BaseEntityWithSprite {

  constructor(props : KnobProps){
    super();
    const {thumbnail, texture, ..._props} = props;
    classAssign(this, _props);
    this.ctorMedias({thumbnail, texture});
  }
}