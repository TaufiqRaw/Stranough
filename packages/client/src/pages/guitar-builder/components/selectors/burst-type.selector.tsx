import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

const burstTypeImages : {[key in keyof typeof GuitarBuilder.burstTypes] : string} = {
  "top-back" : "/assets/gui/burst-types/top-back.jpg",
  top : "/assets/gui/burst-types/top.jpg",
}

export const BurstTypeSelector = ()=><ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.burstTypes).map(i=>({
    ...i,
    thumbnailSrc : burstTypeImages[i.key]
  }))}
  onClick={(item, o, ctx)=>{
    ctx.getSelectedCategoryObj()?.burstType.set(item.key);
  }}
  selected={(item, ctx)=>item.key === ctx.getSelectedCategoryObj()?.burstType.get()}
  type="image"
  nullable
  onClear={(ctx)=>ctx.getSelectedCategoryObj()?.burstType.set(undefined)}
  hasSelected={(ctx)=>ctx.getSelectedCategoryObj()?.burstType.get() !== undefined}
/>