import { Cascade, Entity, Enum, ManyToOne, PrimaryKey, Ref, Unique, ref, wrap } from "@mikro-orm/core";
import { GuitarBody, GuitarBodyTexture, GuitarModel } from ".";
import { idProperty } from '../utils/id-property.util';
import * as Enums from "../enums";

@Entity()
@Unique({properties : ['body', 'texture', 'type']})
export class GuitarBodyTexturePivot {
  @PrimaryKey({autoincrement : true, ...idProperty})
  id : number;

  @ManyToOne(()=>GuitarBody, {deleteRule : 'cascade', updateRule : 'cascade'})
  body : Ref<GuitarBody>;

  @ManyToOne(()=>GuitarBodyTexture, {updateRule : 'cascade', deleteRule : 'set null', cascade : [Cascade.ALL]})
  texture ?: Ref<GuitarBodyTexture>;

  @Enum(()=>Enums.GuitarBodyTextureType)
  type : Enums.GuitarBodyTextureType;

  constructor(props : {
    body : GuitarBody;
    texture ?: GuitarBodyTexture;
    type : Enums.GuitarBodyTextureType;
  }){
    const body = ref(props.body);
    const texture = props.texture && ref(props.texture);
    Object.assign(this, {...props, body, texture});
  }
}