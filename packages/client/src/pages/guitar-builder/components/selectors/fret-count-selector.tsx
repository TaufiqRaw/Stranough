import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

export const FretCountSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.fretCount)}
  onClick={(item, o, ctx)=>{
    ctx.getSelectedCategoryObj()?.fretCount.set(item.key);
  }}
  selected={(item, ctx)=>item.key === ctx.getSelectedCategoryObj()?.fretCount.get()}
  type="text"
/>