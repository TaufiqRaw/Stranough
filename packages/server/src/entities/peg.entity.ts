import { Entity, Index, ManyToOne, Property, Ref, Unique, ref } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { maxDescriptionLength, mediaFKOption } from "../constants";
import { BaseEntityWithDesc } from "./base-with-desc.entity";

export interface PegProps extends Omit<EntityWithoutBase<Peg>, 'thumbnail' | 'pegCapTexture' | 'pegBackTexture'>{
  thumbnail : Media;
  pegCapTexture : Media;
  pegBackTexture : Media;
}

@Entity()
// @Index({ name: 'peg_hnsw_l2_idx', expression: 'CREATE INDEX "peg_hnsw_l2_idx" ON "peg" USING hnsw (embedding vector_l2_ops)' })
export class Peg extends BaseEntityWithDesc {

  @ManyToOne(()=>Media, mediaFKOption)
  thumbnail ?: Ref<Media>;

  @Property()
  price : number;

  @ManyToOne(()=>Media, mediaFKOption)
  pegCapTexture : Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  pegBackTexture : Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  pegRodTexture ?: Ref<Media>;

  @Property({type : 'json'})
  pegRodPivotPosition : Position;

  @Property({type : 'json'})
  pegBackPivotPosition : Position;

  @Property({type : 'float'})
  scale ?: number;

  @Property({type : 'json'})
  pivotPosition : Position;

  @Property()
  isBass : boolean;

  @Property()
  forSlottedHeadstock : boolean;

  @Property()
  slottedGuardColor ?: string;

  @Property()
  slottedStringCount ?: number;

  constructor(props : PegProps){
    super();
    const {thumbnail, pegCapTexture, pegBackTexture, ..._props} = props;
    classAssign(this, _props);
    if(thumbnail) this.thumbnail = ref(thumbnail);
    this.pegCapTexture = ref(pegCapTexture);
    this.pegBackTexture = ref(pegBackTexture);
  }

  async loadMedias(){
    await this.thumbnail?.load();
    await this.pegCapTexture.load();
    await this.pegBackTexture.load();
    await this.pegRodTexture?.load();
  }
}