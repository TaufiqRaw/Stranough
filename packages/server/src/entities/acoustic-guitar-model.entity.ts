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
import { GuitarBody } from "./guitar-body.entity";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Pickguard } from "./pickguard.entity";
import { Media } from "./media.entity";
import { ElectricModelBodyPivot } from "./electric-model-body.pivot.entity";
import {
  Position,
  PositionWithRotation,
} from "../interfaces/position.interface";
import { BaseEntityWithDesc } from "./base-with-desc.entity";
import { Mutable } from "utility-types";
import { mediaFKOption } from "../constants";
import {
  GuitarModel as cGuitarModel,
  GuitarBody as cGuitarBody,
  AcousticModel,
} from "stranough-common";

export type AcousticModelProps = Omit<
  EntityWithoutBase<AcousticGuitarModel>,
  | "pickguards"
  | "headstocks"
  | (typeof cGuitarModel.bodyKeys)[number]
  | "modelBodyPivot"
  | "thumbnail"
> & {
  thumbnail?: Media;
};

/* invariants : 
    acousticCutaway : 
      always has 4 items,
      on creation, all 4 items are added
      none, soft, venetian, florentine
    loadBodies :  will not load the body if it is already loaded or already set (by the setter)
*/
@Entity()
@Index({
  name: "acoustic_guitar_model_hnsw_l2_idx",
  expression:
    'CREATE INDEX "acoustic_guitar_model_hnsw_l2_idx" ON "acoustic_guitar_model" USING hnsw (embedding vector_l2_ops)',
})
export class AcousticGuitarModel extends BaseEntityWithDesc {
  static mediaKeys = Object.freeze([
    "thumbnail",
    ...AcousticModel.cutawayKeys,
    ...AcousticModel.cutawayBurstKeys,
  ] as const);

  @ManyToOne(() => Media, mediaFKOption)
  thumbnail?: Ref<Media>;

  @Property({ type: "json" })
  fingerboardSpawnPoint?: Position;

  @Property({ type: "json" })
  fingerboardBackEndSpawnPoint?: Position;

  @Property({ type: "json" })
  bridgeSpawnPoint?: Position;

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
    const { thumbnail, ...props } = _props;
    thumbnail && (this.thumbnail = ref(thumbnail));

    classAssign(this, props);
  }

  async loadMedias() {
    for (const key of AcousticGuitarModel.mediaKeys) {
      await this[key]?.load();
    }
  }
}
