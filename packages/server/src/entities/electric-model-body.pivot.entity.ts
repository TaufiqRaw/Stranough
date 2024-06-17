import { BeforeDelete, Cascade, ChangeSetType, Entity, Enum, EventArgs, ManyToOne, PrimaryKey, Ref, Unique, ref, wrap } from "@mikro-orm/core";
import { GuitarBody, ElectricGuitarModel } from ".";
import { idProperty } from '../utils/id-property.util';
import * as Enums from "../enums";
import { Mutable } from "utility-types";
import * as Common from 'stranough-common';

@Entity()
@Unique({properties : ['model', 'body', 'type']})
export class ElectricModelBodyPivot {
  @PrimaryKey({autoincrement : true, ...idProperty})
  id : number;

  @ManyToOne(()=>ElectricGuitarModel, {deleteRule : 'cascade', updateRule : 'cascade'})
  model : Ref<ElectricGuitarModel>;

  @ManyToOne(()=>GuitarBody, {updateRule : 'cascade', deleteRule : 'set null', cascade : [Cascade.REMOVE]})
  body ?: Ref<GuitarBody>;

  @Enum({
    items : Array.from(Common.GuitarModel.bodyKeys),
  })
  type : typeof Common.GuitarModel.bodyKeys[number];

  constructor(props : {
    model : ElectricGuitarModel;
    body ?: GuitarBody;
    type : typeof Common.GuitarModel.bodyKeys[number];
  }){
    const model = ref(props.model);
    const body = props.body && ref(props.body);
    Object.assign(this, {...props, model, body});
  }
}