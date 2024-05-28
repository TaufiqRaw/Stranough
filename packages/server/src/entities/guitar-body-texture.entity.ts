import { AfterDelete, BeforeDelete, Cascade, Entity, EventArgs, ManyToOne, OneToMany, OneToOne, Property, Ref, ref } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { GuitarBody } from "./guitar-body.entity";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { Media } from "./media.entity";
import {Optional} from 'utility-types'
import { GuitarBodyTexturePivot } from "./guitar-body-texture.pivot.entity";
import { mediaFKOption } from "../constants";


export type GuitarBodyTextureProps = Omit<Optional<EntityWithoutBase<GuitarBodyTexture>, 'scale'>, 'bodyTexturePivot'>;

@Entity()
export class GuitarBodyTexture extends BaseEntity {

  @OneToMany(()=>GuitarBodyTexturePivot, (p)=>p.texture)
  bodyTexturePivot : GuitarBody;

  @Property({type : 'float'})
  scale : number = 1;

  @ManyToOne(()=>Media, mediaFKOption)
  frontHoleMask ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  mask ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  backMask ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  frontShadowTexture ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  backShadowTexture ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  frontSpecularTexture ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  backSpecularTexture ?: Ref<Media>;

  constructor(props : GuitarBodyTextureProps){
    super();
    const {frontHoleMask, mask, backMask, frontShadowTexture, backShadowTexture, frontSpecularTexture, backSpecularTexture, ..._props} = props;
    Object.assign(this, {..._props,
      frontHoleMask : frontHoleMask && ref(frontHoleMask),
      mask : mask && ref(mask),
      backMask : backMask && ref(backMask),
      frontShadowTexture : frontShadowTexture && ref(frontShadowTexture),
      backShadowTexture : backShadowTexture && ref(backShadowTexture),
      frontSpecularTexture : frontSpecularTexture && ref(frontSpecularTexture),
      backSpecularTexture : backSpecularTexture && ref(backSpecularTexture),
    });
  }

  async loadMedias(){
    await this.frontHoleMask?.load();
    await this.mask?.load();
    await this.backMask?.load();
    await this.frontShadowTexture?.load();
    await this.backShadowTexture?.load();
    await this.frontSpecularTexture?.load();
    await this.backSpecularTexture?.load();
  }
}