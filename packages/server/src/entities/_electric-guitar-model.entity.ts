import {
  Cascade,
  Collection,
  Entity,
  Enum,
  Index,
  ManyToOne,
  OneToMany,
  Property,
  ref,
  Ref,
} from "@mikro-orm/core";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Pickguard } from "./pickguard.entity";
import { Media } from "./media.entity";
import {
  Position,
  PositionWithRotation,
} from "../interfaces/position.interface";
import { BaseEntityWithDesc } from "./base-with-desc.entity";
import { mediaFKOption } from "../constants";
import { ElectricModel as ElectricModelConfig} from "stranough-common";
import * as R from "remeda";

export type GuitarModelProps = Omit<
  EntityWithoutBase<ElectricGuitarModel>,
  "pickguards" 
  | "headstocks" 
  | (typeof ElectricModelConfig.constructionMaskKeys)[number] 
  | (typeof ElectricModelConfig.contourShadowKeys)[number]
  | (typeof ElectricModelConfig.contourSpecKeys)[number]
  | 'modelBodyPivot' 
  | 'thumbnail'
> & {
  thumbnail?: Media;
} & {
  [k in typeof ElectricModelConfig.constructionMaskKeys[number]]?: Media;
} & {
  [k in typeof ElectricModelConfig.contourShadowKeys[number]]?: Media;
} & {
  [k in typeof ElectricModelConfig.contourSpecKeys[number]]?: Media;
};

@Entity()
// @Index({ name: 'electric_guitar_model_hnsw_l2_idx', expression: 'CREATE INDEX "electric_guitar_model_hnsw_l2_idx" ON "electric_guitar_model" USING hnsw (embedding vector_l2_ops)' })
export class ElectricGuitarModel extends BaseEntityWithDesc {
  static mediaKeys = Object.freeze([
    "thumbnail",
    ...ElectricModelConfig.constructionMaskKeys, ...ElectricModelConfig.contourShadowKeys, ...ElectricModelConfig.contourSpecKeys
  ] as const);

  @ManyToOne(() => Media, mediaFKOption)
  thumbnail?: Ref<Media>;

  @Property()
  price : number;

  @Property({ type: "json" })
  fingerboardSpawnPoint?: Position;

  @Property({ type: "json" })
  fingerboardBackEndSpawnPoint?: Position;

  @Property({ type: "json" })
  bridgeSpawnPoint?: Position;

  @Property({ type: "json" })
  pickguardSpawnPoint?: Position;

  @Property({ type: "json" })
  pickupSpawnPoint?: {
    bridge?: Position;
    middle?: Position;
    neck?: Position;
  };

  @Property({ type: "float" })
  maskScale?: number = 1;

  @Property({ type: "json" })
  knobSpawnPoint?: Position[];

  @Property({ type: "json" })
  switchSpawnPoint?: PositionWithRotation;

  @Property({ type: "json" })
  topJackSpawnPoint?: PositionWithRotation;

  @Property({ type: "json" })
  sideJackSpawnPoint?: PositionWithRotation;

  @ManyToOne(() => Media, mediaFKOption)
  boltOnConstructionMask?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  setInConstructionMask?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  neckThroughConstructionMask?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  flatContourShadow ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  flatContourSpec ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  forearmContourShadow ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  forearmContourSpec ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  tummyContourShadow ?: Ref<Media>;
  
  @ManyToOne(()=>Media, mediaFKOption)
  tummyContourSpec ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  carvedContourShadow ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  carvedContourSpec ?: Ref<Media>;

  @OneToMany(() => Pickguard, (p) => p.model)
  pickguards = new Collection<Pickguard>(this);

  constructor(_props: GuitarModelProps) {
    super();
    const props = R.pick(_props, ElectricGuitarModel.mediaKeys);
    const propsNonMedia = R.omit(_props, ElectricGuitarModel.mediaKeys);
    classAssign(this, propsNonMedia);

    // set medias
    let prop : typeof ElectricGuitarModel.mediaKeys[number]
    for(prop in props){
      if(props[prop]){
        this[prop] = ref(props[prop]!);
      }
    }
  }

  async loadMedias(){
    for(const key of ElectricGuitarModel.mediaKeys){
      await this[key]?.load();
    }
  }
}
