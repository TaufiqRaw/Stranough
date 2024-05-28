import { Cascade, ManyToOne, Property, Ref, Unique, ref} from "@mikro-orm/core";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import { Position } from "../interfaces/position.interface";
import { BaseEntity } from "./base.entity";
import { maxDescriptionLength, mediaFKOption } from "../constants";

export abstract class BaseEntityWithSprite extends BaseEntity {
  @Property()
  @Unique()
  name : string;

  @Property({type : 'varchar', length : maxDescriptionLength})
  description : string;

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