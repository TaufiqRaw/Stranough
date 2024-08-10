import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

export const UseFretSelector = ()=><ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.binaryOptions)}
  onClick={(item, o, ctx)=>{
    ctx.getSelectedCategoryObj()?.useFret.set(item.key === 'yes');
  }}
  selected={(item, ctx)=>item.key === (ctx.getSelectedCategoryObj()?.useFret.get() ? 'yes' : 'no')}
  type="text"
/> 