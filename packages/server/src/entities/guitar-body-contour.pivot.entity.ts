import { Cascade, Entity, Enum, ManyToOne, PrimaryKey, Ref, Unique, ref, wrap } from "@mikro-orm/core";
import { GuitarBody, GuitarBodyContour, ElectricGuitarModel } from ".";
import { idProperty } from '../utils/id-property.util';
import * as Enums from "../enums";
import { Mutable } from "utility-types";
import * as Common from 'stranough-common';

@Entity()
@Unique({properties : ['body', 'texture', 'type']})
export class GuitarBodyContourPivot {
  @PrimaryKey({autoincrement : true, ...idProperty})
  id : number;

  @ManyToOne(()=>GuitarBody, {deleteRule : 'cascade', updateRule : 'cascade'})
  body : Ref<GuitarBody>;

  @ManyToOne(()=>GuitarBodyContour, {updateRule : 'cascade', deleteRule : 'set null', cascade : [Cascade.ALL]})
  texture ?: Ref<GuitarBodyContour>;

  @Enum({items : Array.from(Common.GuitarBody.contourKeys) })
  type : typeof Common.GuitarBody.contourKeys[number];

  constructor(props : {
    body : GuitarBody;
    texture ?: GuitarBodyContour;
    type : typeof Common.GuitarBody.contourKeys[number];
  }){
    const body = ref(props.body);
    const texture = props.texture && ref(props.texture);
    Object.assign(this, {...props, body, texture});
  }
}