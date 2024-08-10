import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

export const OrientationSelector = ()=><ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.orientation)}
  onClick={(orientation, o, ctx)=>{
    ctx.orientation.set(orientation.key);
  }}
  selected={(orientation, ctx)=>orientation.key === ctx.orientation.get()}
  type="text"
/> 