import { BeforeDelete, Cascade, ChangeSetType, Entity, Enum, EventArgs, ManyToOne, PrimaryKey, Ref, Unique, ref, wrap } from "@mikro-orm/core";
import { GuitarBody, GuitarModel } from ".";
import { idProperty } from '../utils/id-property.util';
import * as Enums from "../enums";

@Entity()
@Unique({properties : ['model', 'body', 'type']})
export class GuitarModelBodyPivot {
  @PrimaryKey({autoincrement : true, ...idProperty})
  id : number;

  @ManyToOne(()=>GuitarModel, {deleteRule : 'cascade', updateRule : 'cascade'})
  model : Ref<GuitarModel>;

  @ManyToOne(()=>GuitarBody, {updateRule : 'cascade', deleteRule : 'set null', cascade : [Cascade.REMOVE]})
  body ?: Ref<GuitarBody>;

  @Enum(()=>Enums.GuitarBodyType)
  type : Enums.GuitarBodyType;

  constructor(props : {
    model : GuitarModel;
    body ?: GuitarBody;
    type : Enums.GuitarBodyType;
  }){
    const model = ref(props.model);
    const body = props.body && ref(props.body);
    Object.assign(this, {...props, model, body});
  }
}