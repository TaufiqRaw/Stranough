import { Cascade, ManyToOne, Property, Ref, Unique, ref} from "@mikro-orm/core";
import { Media } from "./media.entity";
import { Position } from "../interfaces/position.interface";
import { mediaFKOption } from "../constants";
import { BaseEntityWithDesc } from "./base-with-desc.entity";

export abstract class BaseEntityWithSprite extends BaseEntityWithDesc {

  @ManyToOne(()=>Media, mediaFKOption)
  thumbnail ?: Ref<Media>;

  @Property()
  price : number;

  @ManyToOne(()=>Media, mediaFKOption)
  texture : Ref<Media>;

  @Property({type : 'float'})
  scale : number;

  @Property({type : 'json'})
  pivotPosition : Position;

  protected ctorMedias(props : {
    thumbnail ?: Media,
    texture : Media,
  }){
    if(props.thumbnail)
      this.thumbnail = ref(props.thumbnail);
    this.texture = ref(props.texture);
  }

  async loadMedias(){
    await this.thumbnail?.load();
    await this.texture.load();
  }
}