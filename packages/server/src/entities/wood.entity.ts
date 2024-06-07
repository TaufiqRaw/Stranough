import { Entity, Index, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";
import { BaseEntityWithDesc } from "./base-with-desc.entity";
import { Ref, ref } from "@mikro-orm/core";
import { Media } from "./media.entity";
import { mediaFKOption } from "../constants";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";

export type WoodProps = Omit<EntityWithoutBase<Wood>, 'texture'> & { texture : Media };

@Entity()
@Index({ name: 'wood_hnsw_l2_idx', expression: 'CREATE INDEX "wood_hnsw_l2_idx" ON "wood" USING hnsw (embedding vector_l2_ops)' })
export class Wood extends BaseEntityWithDesc {

  @Property()
  price : number;

  @ManyToOne(()=>Media, mediaFKOption)
  texture : Ref<Media>;

  constructor(_props : WoodProps){
    super();
    const { texture, ...props } = _props;
    this.texture = ref(texture);
    Object.assign(this, props);
  }

  async loadMedias(){
    await this.texture.load();
  }
}