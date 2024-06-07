import { Cascade, Entity, Enum, ManyToOne, PrimaryKey, Ref, Unique, ref, wrap } from "@mikro-orm/core";
import { GuitarBody, GuitarBodyTexture, GuitarModel } from ".";
import { idProperty } from '../utils/id-property.util';
import * as Enums from "../enums";
import { Mutable } from "utility-types";

@Entity()
@Unique({properties : ['body', 'texture', 'type']})
export class GuitarBodyTexturePivot {
  @PrimaryKey({autoincrement : true, ...idProperty})
  id : number;

  @ManyToOne(()=>GuitarBody, {deleteRule : 'cascade', updateRule : 'cascade'})
  body : Ref<GuitarBody>;

  @ManyToOne(()=>GuitarBodyTexture, {updateRule : 'cascade', deleteRule : 'set null', cascade : [Cascade.ALL]})
  texture ?: Ref<GuitarBodyTexture>;

  @Enum({items : [ 'carvedTopTexture', 'tummyCutTexture', 'forearmCutTexture', 'flatTopBackTexture', 'carvedTopBackTexture', 'forearmTummyCutTexture', 'carvedTopTummyCutTexture' ] as Mutable<typeof GuitarBody.textureKeys> })
  type : typeof GuitarBody.textureKeys[number];

  constructor(props : {
    body : GuitarBody;
    texture ?: GuitarBodyTexture;
    type : typeof GuitarBody.textureKeys[number];
  }){
    const body = ref(props.body);
    const texture = props.texture && ref(props.texture);
    Object.assign(this, {...props, body, texture});
  }
}