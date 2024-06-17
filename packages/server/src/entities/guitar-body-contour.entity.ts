import { AfterDelete, BeforeDelete, Cascade, Entity, EventArgs, ManyToOne, OneToMany, OneToOne, Property, Ref, ref } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import { GuitarBody } from "./guitar-body.entity";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { Media } from "./media.entity";
import {Optional} from 'utility-types'
import { GuitarBodyContourPivot } from "./guitar-body-contour.pivot.entity";
import { mediaFKOption } from "../constants";
import * as Enums from "../enums";


export type GuitarBodyContourProps = Omit<EntityWithoutBase<GuitarBodyContour>, 'bodyContourPivot' | typeof GuitarBodyContour.mediaKeys[number]> & {[key in typeof GuitarBodyContour.mediaKeys[number]]?: Media | undefined};

@Entity()
export class GuitarBodyContour extends BaseEntity {

  static mediaKeys = Object.freeze(
    [ 'shadowTexture', 'specularTexture'] as const
  );

  @OneToMany(()=>GuitarBodyContourPivot, (p)=>p.texture)
  bodyContourPivot : GuitarBodyContourPivot;

  @Property({nullable : false, default : 0})
  price ?: number = 0;

  @ManyToOne(()=>Media, mediaFKOption)
  shadowTexture ?: Ref<Media>;

  @ManyToOne(()=>Media, mediaFKOption)
  specularTexture ?: Ref<Media>;

  constructor(props : GuitarBodyContourProps){
    super();
    const {shadowTexture, specularTexture, ..._props} = props;
    Object.assign(this, {..._props,
      shadowTexture : shadowTexture && ref(shadowTexture),
      specularTexture : specularTexture && ref(specularTexture),
    });
  }

  async loadMedias(){
    for(const key of GuitarBodyContour.mediaKeys){
      await this[key]?.load();
    }
  }
}