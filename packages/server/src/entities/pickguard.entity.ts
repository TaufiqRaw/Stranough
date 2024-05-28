import { Entity, ManyToOne, Property, Ref, ref } from "@mikro-orm/core";
import { BaseEntity } from "./base.entity";
import {Position} from "../interfaces/position.interface";
import { EntityWithoutBase } from "../interfaces/entity-without-base.interface";
import { classAssign } from "../utils/class-assign.util";
import { GuitarModel } from "./guitar-model.entity";
import { Media } from "./media.entity";
import { idProperty } from "../utils/id-property.util";
import { maxDescriptionLength, mediaFKOption } from "../constants";

export interface PickguardProps extends Omit<EntityWithoutBase<Pickguard>, 'texture'>{
  texture : Media;
};

@Entity()
export class Pickguard extends BaseEntity {
  @Property()
  name : string;

  @Property({type : 'varchar', length : maxDescriptionLength})
  description : string;

  @Property()
  price : number;

  @ManyToOne(()=>Media, mediaFKOption)
  texture : Ref<Media>;

  @Property({type : 'float'})
  scale : number;

  @Property({type : 'json'})
  pivotPosition : Position;

  @ManyToOne(()=>GuitarModel)
  model : GuitarModel;

  constructor(props : PickguardProps){
    super();
    const {texture, ..._props} = props;
    classAssign(this, props);
    this.texture = ref(texture);
  }

  async loadMedias(){
    await this.texture.load();
  }
}