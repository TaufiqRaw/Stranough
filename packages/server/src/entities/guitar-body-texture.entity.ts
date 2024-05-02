import { AfterDelete, BeforeDelete, Entity, EventArgs, ManyToOne, OneToOne, Property } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { GuitarBody } from "./guitar-body.entity";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import {Optional} from 'utility-types'


export type GuitarBodyTextureProps = Optional<EntityWithoutBase<GuitarBodyTexture>, 'scale'>;

@Entity()
export class GuitarBodyTexture extends BaseEntity {

  @OneToOne(()=>GuitarBody, {deleteRule : 'cascade', updateRule : 'cascade', owner : false})
  body : GuitarBody;

  @Property({type : 'float'})
  scale : number = 1;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  frontHoleMask ?: Media;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  frontMask ?: Media;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  backMask ?: Media;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  frontShadowTexture ?: Media;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  backShadowTexture ?: Media;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  frontSpecularTexture ?: Media;

  @ManyToOne(()=>Media, {deleteRule : 'set null', updateRule : 'cascade'})
  backSpecularTexture ?: Media;

  constructor(props : GuitarBodyTextureProps){
    super();
    Object.assign(this, props);
  }

  //TODO: when deleting, delete all associated media
  
}