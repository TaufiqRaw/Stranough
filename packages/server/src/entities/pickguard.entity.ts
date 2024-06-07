import { Entity, Index, ManyToOne, Property, Ref, ref } from "@mikro-orm/core";
import {Position} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { GuitarModel } from "./guitar-model.entity";
import { Media } from "./media.entity";
import { maxDescriptionLength, mediaFKOption } from "../constants";
import { BaseEntityWithDesc } from "./base-with-desc.entity";

export interface PickguardProps extends Omit<EntityWithoutBase<Pickguard>, 'texture'>{
  texture : Media;
};

@Entity()
@Index({ name: 'pickguard_hnsw_l2_idx', expression: 'CREATE INDEX "pickguard_hnsw_l2_idx" ON "pickguard" USING hnsw (embedding vector_l2_ops)' })
export class Pickguard extends BaseEntityWithDesc {

  @Property()
  price : number;

  @ManyToOne(()=>Media, mediaFKOption)
  texture : Ref<Media>;

  @Property({type : 'float'})
  scale : number;

  @Property({type : 'json'})
  pivotPosition : Position;

  @ManyToOne(()=>GuitarModel)
  model : GuitarModel;

  constructor(props : PickguardProps){
    super();
    const {texture, ..._props} = props;
    classAssign(this, props);
    this.texture = ref(texture);
  }

  async loadMedias(){
    await this.texture.load();
  }
}