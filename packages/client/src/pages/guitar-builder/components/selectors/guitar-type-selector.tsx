import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

export const GuitarTypeSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.guitarTypes)}
  onClick={(type, o, ctx)=>{
    ctx.guitarType.set(type.key);
  }}
  selected={(type, ctx)=> type.key === ctx.guitarType.get()}
  type="text"
/>