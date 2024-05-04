import { Cascade, Entity, ManyToOne, OneToOne, Property, Unique } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { GuitarModel } from "./guitar-model.entity";
import { GuitarBodyTexture } from "./guitar-body-texture.entity";
import {Position, PositionWithRotation} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";

export type GuitarBodyProps = EntityWithoutBase<GuitarBody>;

@Entity()
export class GuitarBody extends BaseEntity {
  @OneToOne(()=>GuitarModel, {deleteRule : 'cascade', updateRule : 'cascade', owner : false})
  model : GuitarModel;

  @Property({type : 'json'})
  fingerboardSpawnPoint ?: Position;

  @Property({type : 'json'})
  bridgeSpawnPoint ?: Position;

  @Property({type : 'json'})
  pickupSpawnPoint ?: {
    bridge ?: Position;
    middle ?: Position;
    neck ?: Position;
  };

  @Property({type : 'json'})
  knobSpawnPoint ?: Position[];

  @Property({type : 'json'})
  switchSpawnPoint ?: PositionWithRotation;

  @Property({type : 'json'})
  topJackSpawnPoint ?: PositionWithRotation;

  @Property({type : 'json'})
  sideJackSpawnPoint ?: PositionWithRotation;

  @OneToOne(()=>GuitarBodyTexture , b=>b.body, {owner : true})
  flatTopBackTexture ?: GuitarBodyTexture;

  @OneToOne(()=>GuitarBodyTexture, b=>b.body, {owner : true})
  forearmCutTexture ?: GuitarBodyTexture;

  @OneToOne(()=>GuitarBodyTexture, b=>b.body, {owner : true})
  tummyCutTexture ?: GuitarBodyTexture;

  @OneToOne(()=>GuitarBodyTexture, b=>b.body, {owner : true})
  forearmTummyCutTexture ?: GuitarBodyTexture;

  @OneToOne(()=>GuitarBodyTexture, b=>b.body, {owner : true})
  carvedTopTexture ?: GuitarBodyTexture;

  @OneToOne(()=>GuitarBodyTexture, b=>b.body, {owner : true})
  carvedTopBackTexture ?: GuitarBodyTexture;

  @OneToOne(()=>GuitarBodyTexture, b=>b.body, {owner : true})
  carvedTopTummyCutTexture ?: GuitarBodyTexture;

  constructor(props : GuitarBodyProps){
    super();
    classAssign(this, props);
  }
}