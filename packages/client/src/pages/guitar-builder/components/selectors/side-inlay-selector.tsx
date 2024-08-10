import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

export const SideInlaySelector = ()=><ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.sideInlay)}
  onClick={(orientation, o, ctx)=>{
    ctx.getSelectedCategoryObj()?.sideInlay.set(orientation.key);
  }}
  selected={(orientation, ctx)=>orientation.key === ctx.getSelectedCategoryObj()?.sideInlay.get()}
  type="text"
  nullable={GuitarBuilder.nullableSelectedItem.common.sideInlay}
  hasSelected={ctx=>ctx.getSelectedCategoryObj()?.sideInlay.get() !== undefined}
  onClear={ctx=>ctx.getSelectedCategoryObj()?.sideInlay.set(undefined)}
/> 