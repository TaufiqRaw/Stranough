import {
  BeforeUpdate,
  Cascade,
  Collection,
  Entity,
  Enum,
  EventArgs,
  Index,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
  ref,
  Ref,
  Unique,
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
  | (typeof ElectricModelConfig.contourOverlayKeys)[number]
  | 'modelBodyPivot' 
  | 'thumbnail'
  | 'mask'
  | 'bridgeToBottom'
> & {
  thumbnail?: Media;
  mask?: Media;
  electronicCoverOverlay?: Media;
} & {
  [k in typeof ElectricModelConfig.contourOverlayKeys[number]]?: Media;
}

@Entity()
// @Index({ name: 'electric_guitar_model_hnsw_l2_idx', expression: 'CREATE INDEX "electric_guitar_model_hnsw_l2_idx" ON "electric_guitar_model" USING hnsw (embedding vector_l2_ops)' })
export class ElectricGuitarModel extends BaseEntityWithDesc {
  static mediaKeys = Object.freeze([
    "thumbnail",
    "mask",
    ...ElectricModelConfig.contourOverlayKeys
  ] as const);

  @ManyToOne(() => Media, mediaFKOption)
  thumbnail?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  mask?: Ref<Media>;

  @Property({ type: "float" })
  maskScale?: number = 1;

  @Property()
  price : number;

  @Property()
  isBass?: boolean = false;

  @Property()
  mirrorSoundHole?: boolean = false;

  @Property()
  flipElectronicCover?: boolean = false;

  @Property()
  bridgeToBottom?: number;

  @Property({ type: "json" })
  soundHoleSpawnPointLeft?: PositionWithRotation;

  @Property({ type: "json" })
  soundHoleSpawnPointRight?: PositionWithRotation;

  @Property({ type: "float" })
  soundHoleScale?: number = 1;

  @Property({ type: "json" })
  electronicCoverSpawnPoint?: PositionWithRotation;

  @Property({ type: "json" })
  minorElectronicCoverSpawnPoint?: PositionWithRotation;

  @Property({ type: "json" })
  batteryCoverSpawnPoint?: PositionWithRotation;

  @Property({ type: "json" })
  logoSpawnPoint?: PositionWithRotation;

  @Property({ type: "json" })
  strapPinSpawnPoints ?: PositionWithRotation[];

  @Property({ type: "json" })
  knobSpawnPoint?: Position[];

  @Property({ type: "json" })
  bridgeSpawnPoint: Position;

  @Property({ type: "json" })
  switchSpawnPoint?: PositionWithRotation;

  @Property({ type: "json" })
  topJackSpawnPoint?: PositionWithRotation;

  @Property({ type: "json" })
  sideJackSpawnPoint?: PositionWithRotation;

  @Property({ type: "json" })
  topSpawnPoint?: Position;

  @Property({ type: "json" })
  bottomSpawnPoint: Position;

  @OneToMany(() => Pickguard, (pickguard) => pickguard.model, { cascade: [Cascade.ALL] })
  pickguards ?: Collection<Pickguard>;

  // ----------------- CONTOUR OVERLAYS -----------------

  @ManyToOne(()=>Media, mediaFKOption)
  flatContourOverlay ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  forearmContourOverlay ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  tummyContourOverlay ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  carvedContourOverlay ?: Ref<Media>;

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
    this.bridgeToBottom =  _props.bottomSpawnPoint.y - _props.bridgeSpawnPoint?.y;
  }

  async loadMedias(){
    for(const key of ElectricGuitarModel.mediaKeys){
      await this[key]?.load();
    }
  }

  @BeforeUpdate()
  async beforeUpdate(args: EventArgs<ElectricGuitarModel>) {
    const etty = args.entity;
    if(etty.bridgeSpawnPoint.y && etty.bottomSpawnPoint.y){
      this.bridgeToBottom = etty.bottomSpawnPoint.y - etty.bridgeSpawnPoint.y;
    }else if(etty.bridgeSpawnPoint.y){
      this.bridgeToBottom = this.bottomSpawnPoint.y - etty.bridgeSpawnPoint.y;
    }else if(etty.bottomSpawnPoint.y){
      this.bridgeToBottom = etty.bottomSpawnPoint.y - this.bridgeSpawnPoint.y;
    }
  }
}
