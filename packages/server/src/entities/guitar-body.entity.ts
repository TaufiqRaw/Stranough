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
  @OneToOne(()=>GuitarModel, {deleteRule : 'cascade', updateRule : 'cascade', owner : false, mappedBy : 'boltOnBody'})
  @OneToOne(()=>GuitarModel, {deleteRule : 'cascade', updateRule : 'cascade', owner : false, mappedBy : 'neckThroughBody'})
  @OneToOne(()=>GuitarModel, {deleteRule : 'cascade', updateRule : 'cascade', owner : false, mappedBy : 'setInBody'})
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

  @OneToOne(()=>GuitarBodyTexture , b=>b.body, {owner : true, orphanRemoval : true})
  flatTopBackTexture ?: GuitarBodyTexture;

  @OneToOne(()=>GuitarBodyTexture, b=>b.body, {owner : true, orphanRemoval : true})
  forearmCutTexture ?: GuitarBodyTexture;

  @OneToOne(()=>GuitarBodyTexture, b=>b.body, {owner : true, orphanRemoval : true})
  tummyCutTexture ?: GuitarBodyTexture;

  @OneToOne(()=>GuitarBodyTexture, b=>b.body, {owner : true, orphanRemoval : true})
  forearmTummyCutTexture ?: GuitarBodyTexture;

  @OneToOne(()=>GuitarBodyTexture, b=>b.body, {owner : true, orphanRemoval : true})
  carvedTopTexture ?: GuitarBodyTexture;

  @OneToOne(()=>GuitarBodyTexture, b=>b.body, {owner : true, orphanRemoval : true})
  carvedTopBackTexture ?: GuitarBodyTexture;

  @OneToOne(()=>GuitarBodyTexture, b=>b.body, {owner : true, orphanRemoval : true})
  carvedTopTummyCutTexture ?: GuitarBodyTexture;

  constructor(props : GuitarBodyProps){
    super();
    classAssign(this, props);
  }
}