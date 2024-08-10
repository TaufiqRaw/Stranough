import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

export const FingerboardRadiusSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.fingerboardRadius)}
  onClick={(item, o, ctx)=>{
    ctx.getSelectedCategoryObj()?.fingerboardRadius.set(item.key);
  }}
  selected={(item, ctx)=>item.key === ctx.getSelectedCategoryObj()?.fingerboardRadius.get()}
  type="text"
/>