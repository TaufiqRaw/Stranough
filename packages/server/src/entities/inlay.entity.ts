import { Entity, Index, ManyToOne, Property, Ref, ref } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithSprite, EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import { BaseEntityWithSprite } from "./base-with-sprite.entity";
import { BaseEntityWithDesc } from "./base-with-desc.entity";
import { mediaFKOption } from "../constants";
import * as R from 'remeda';

export type InlayProps = Omit<
  EntityWithoutBase<Inlay>,
  'thumbnail' | `fret${number}`
> & {
  [k in typeof Inlay.mediaKeys[number]]?: Media;
}

@Entity()
// @Index({ name: 'bridge_hnsw_l2_idx', expression: 'CREATE INDEX "bridge_hnsw_l2_idx" ON "bridge" USING hnsw (embedding vector_l2_ops)' })
export class Inlay extends BaseEntityWithDesc{

  static mediaKeys = Object.freeze([
    "thumbnail",
    "fret1",
    "fret2",
    "fret3",
    "fret4",
    "fret5",
    "fret6",
    "fret7",
    "fret8",
    "fret9",
    "fret10",
    "fret11",
    "fret12",
    "fret13",
    "fret14",
    "fret15",
    "fret16",
    "fret17",
    "fret18",
    "fret19",
    "fret20",
    "fret21",
    "fret22",
    "fret23",
    "fret24",
    "fret25",
    "fret26",
    "fret27",
  ] as const);

  @Property({type : 'float'})
  scale ?: number = 1;

  @ManyToOne(() => Media, mediaFKOption)
  thumbnail?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret1 ?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret2?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret3?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret4?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret5?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret6?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret7?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret8?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret9?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret10?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret11?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret12?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret13?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret14?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret15?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret16?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret17?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret18?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret19?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret20?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret21?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret22?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret23?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret24?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret25?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret26?: Ref<Media>;

  @ManyToOne(() => Media, mediaFKOption)
  fret27?: Ref<Media>;

  constructor(props : InlayProps){
    super();
    const mediaProps = R.pick(props, Inlay.mediaKeys);
    const normalProps = R.omit(props, Inlay.mediaKeys);
    classAssign(this, normalProps);
    this.ctorMedias(mediaProps);
  }

  private ctorMedias(mediaProps : {[k in typeof Inlay.mediaKeys[number]]?: Media}){
    for(const key of Inlay.mediaKeys){
      const media = mediaProps[key];
      if(media){
        this[key] = ref(media);
      }
    }
  }

  async loadMedias(){
    for(const key of Inlay.mediaKeys){
      const media = this[key];
      if(media){
        await media.load();
      }
    }
  }
}