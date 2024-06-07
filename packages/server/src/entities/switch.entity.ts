import { Entity, Index, ManyToOne, Property } from "@mikro-orm/core";
import { EntityWithSprite, EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";

export type SwitchProps = EntityWithSprite<Switch>;

@Entity()
@Index({ name: 'switch_hnsw_l2_idx', expression: 'CREATE INDEX "switch_hnsw_l2_idx" ON "switch" USING hnsw (embedding vector_l2_ops)' })
export class Switch extends BaseEntityWithSprite {

  constructor(props : SwitchProps){
    super();
    const {thumbnail, texture, ..._props} = props;
    classAssign(this, _props);
    this.ctorMedias({thumbnail, texture});
  }
}