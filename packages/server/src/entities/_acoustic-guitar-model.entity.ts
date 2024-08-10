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
  | "modelBodyPivot"
  | "thumbnail"
> & {
  [k in typeof AcousticGuitarModel.mediaKeys[number]]?: Media;
} & {
  [k in typeof AcousticModelConfig.cutawayMaskKeys[number]]?: Media;
}

@Entity()
// @Index({
//   name: "acoustic_guitar_model_hnsw_l2_idx",
//   expression:
//     'CREATE INDEX "acoustic_guitar_model_hnsw_l2_idx" ON "acoustic_guitar_model" USING hnsw (embedding vector_l2_ops)',
// })
export class AcousticGuitarModel extends BaseEntityWithDesc {
  static mediaKeys = Object.freeze([
    "thumbnail",
    "beveledMask",
    "normalMask",
    ...AcousticModelConfig.cutawayMaskKeys,
  ] as const);

  @ManyToOne(() => Media, mediaFKOption)
  thumbnail?: Ref<Media>;

  @Property()
  price: number;

  @Property({ type: "float" })
  maskScale?: number = 1;

  @ManyToOne(() => Media, mediaFKOption)
  normalMask?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  beveledMask?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  softCutawayMask?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  venetianCutawayMask?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  florentineCutawayMask?: Ref<Media>;

  @Property({ type: "json" })
  bridgeSpawnPoint?: Position;

  @Property({ type: "json" })
  topSpawnPoint?: Position;

  @Property({ type: "json" })
  bottomSpawnPoint?: Position;

  @Property({ type : "json" })
  preampSpawnPoint?: PositionWithRotation;

  @Property({ type: "json" })
  strapPinSpawnPoints ?: PositionWithRotation[];

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
