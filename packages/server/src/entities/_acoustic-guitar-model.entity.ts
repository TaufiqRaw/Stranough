import {
  Entity,
  Index,
  ManyToOne,
  Property,
  ref,
  Ref,
} from "@mikro-orm/core";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import {
  Position,
  PositionWithRotation,
} from "../interfaces/position.interface";
import { BaseEntityWithDesc } from "./base-with-desc.entity";
import { mediaFKOption } from "../constants";
import {
  AcousticModel as AcousticModelConfig,
} from "stranough-common";
import R from "remeda";

export type AcousticModelProps = Omit<
  EntityWithoutBase<AcousticGuitarModel>,
  | "pickguards"
  | "headstocks"
  | (typeof AcousticModelConfig.cutawayMaskKeys)[number]
  | (typeof AcousticModelConfig.cutawayBurstKeys)[number]
  | "modelBodyPivot"
  | "thumbnail"
> & {
  thumbnail?: Media;
} & {
  [k in typeof AcousticModelConfig.cutawayMaskKeys[number]]?: Media;
} & {
  [k in typeof AcousticModelConfig.cutawayBurstKeys[number]]?: Media;
};

@Entity()
// @Index({
//   name: "acoustic_guitar_model_hnsw_l2_idx",
//   expression:
//     'CREATE INDEX "acoustic_guitar_model_hnsw_l2_idx" ON "acoustic_guitar_model" USING hnsw (embedding vector_l2_ops)',
// })
export class AcousticGuitarModel extends BaseEntityWithDesc {
  static mediaKeys = Object.freeze([
    "thumbnail",
    ...AcousticModelConfig.cutawayMaskKeys,
    ...AcousticModelConfig.cutawayBurstKeys,
  ] as const);

  @ManyToOne(() => Media, mediaFKOption)
  thumbnail?: Ref<Media>;

  @Property({ type: "json" })
  fingerboardSpawnPoint?: Position;

  @Property({ type: "json" })
  fingerboardBackEndSpawnPoint?: Position;

  @Property({ type: "json" })
  bridgeSpawnPoint?: Position;

  @Property({ type: "json" })
  pickguardSpawnPoint?: Position;

  @Property()
  price: number;

  @Property({ type: "float" })
  maskScale?: number = 1;

  @Property({ type: "json" })
  jackSpawnPoint?: PositionWithRotation;

  @ManyToOne(() => Media, mediaFKOption)
  noneCutawayMask?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  softCutawayMask?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  venetianCutawayMask?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  florentineCutawayMask?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  noneCutawayBurst?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  softCutawayBurst?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  venetianCutawayBurst?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  florentineCutawayBurst?: Ref<Media>;

  constructor(_props: AcousticModelProps) {
    super();
    const props = R.pick(_props, AcousticGuitarModel.mediaKeys);
    const propsNonMedia = R.omit(_props, AcousticGuitarModel.mediaKeys);
    classAssign(this, propsNonMedia);

    // set medias
    let prop : typeof AcousticGuitarModel.mediaKeys[number]
    for(prop in props){
      if(props[prop]){
        this[prop] = ref(props[prop]!);
      }
    }
  }

  async loadMedias() {
    for (const key of AcousticGuitarModel.mediaKeys) {
      await this[key]?.load();
    }
  }
}
