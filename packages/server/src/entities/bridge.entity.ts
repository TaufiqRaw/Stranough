import { BeforeUpdate, Entity, Enum, EventArgs, Index, ManyToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position, PositionWithRotation} from "../interfaces/position.interface";
import { EntityWithSprite, EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";
import {Bridge as BridgeConfig, Pickup as PickupConfig} from 'stranough-common'

export type BridgeProps = Omit<EntityWithSprite<Bridge>, 'height'>;

@Entity()
// @Index({ name: 'bridge_hnsw_l2_idx', expression: 'CREATE INDEX "bridge_hnsw_l2_idx" ON "bridge" USING hnsw (embedding vector_l2_ops)' })
export class Bridge extends BaseEntityWithSprite{

  @Property({type : 'smallint'})
  stringCount : number;

  @Property({type : 'json'})
  stringSpawnPoint : Position[];

  @Property({type : 'json'})
  bottomPoint : Position;

  @Property()
  isBass : boolean;

  @Property()
  multiscale ?: boolean = false;

  @Property()
  headless ?: boolean = false;

  @Property()
  tremolo ?: boolean = false;

  @Enum(()=>BridgeConfig.BridgeType)
  type : BridgeConfig.BridgeType

  @Enum({
    items : ()=>PickupConfig.PickupType,
    nullable : true
  })
  supportedPickup ?: PickupConfig.PickupType | null;

  @Property({type : 'json'})
  pickupSpawnPoint ?: PositionWithRotation | null;
  
  @Property()
  height ?: number;

  // this holds if the bridge can be placed on a guitar thats not long enough
  @Property()
  extendable ?: boolean = false;

  constructor(props : BridgeProps){
    super();
    const {thumbnail, texture, ..._props} = props;
    classAssign(this, props);
    this.ctorMedias({thumbnail, texture});
    this.height = props.bottomPoint.y;
  }

  @BeforeUpdate()
  async beforeUpdate(args: EventArgs<Bridge>) {
    const etty = args.entity;
    if(etty.bottomPoint.y && (etty.bottomPoint.y !== this.bottomPoint.y)){
      this.height = etty.bottomPoint.y;
    }
  }
}