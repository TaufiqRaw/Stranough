import { Entity, Enum, Index, ManyToOne, OneToOne, Property, Ref, Unique, ref } from "@mikro-orm/core";
import {Position} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { ElectricGuitarModel } from "./_electric-guitar-model.entity";
import { Media } from "./media.entity";
import { maxDescriptionLength, mediaFKOption } from "../constants";
import { BaseEntityWithDesc } from "./base-with-desc.entity";
import { BaseEntity } from "./base.entity";
import { PickguardConfig } from "stranough-common";

export interface PickguardProps extends Omit<EntityWithoutBase<Pickguard>, 'texture'>{
  texture : Media;
};

@Entity()
// @Index({ name: 'pickguard_hnsw_l2_idx', expression: 'CREATE INDEX "pickguard_hnsw_l2_idx" ON "pickguard" USING hnsw (embedding vector_l2_ops)' })
export class Pickguard extends BaseEntity {

  @Property()
  name : string;

  @Property({type : 'varchar', length : maxDescriptionLength})
  description ?: string;

  @Property()
  price : number;

  @ManyToOne(()=>Media, mediaFKOption)
  texture : Ref<Media>;

  @Property({type : 'json'})
  pivotPosition : Position;

  @ManyToOne(()=>ElectricGuitarModel, {deleteRule : 'cascade', updateRule : 'cascade'})
  model : ElectricGuitarModel;

  @Property({type : 'float'})
  scale : number = 1;

  @Enum(()=>PickguardConfig.PickguardType)
  type : PickguardConfig.PickguardType;

  constructor(props : PickguardProps){
    super();
    const {texture, ..._props} = props;
    classAssign(this, _props);
    this.texture = ref(texture);
  }

  async loadMedias(){
    await this.texture.load();
  }
}