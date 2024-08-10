import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";
import { Constants } from "~/constants";

export const bodyCoreWoodSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.bodyCoreWoods).map(w=>({
    ...w,
    thumbnailSrc : Constants.woodUrl[w.key],
  }))}
  onClick={(i, o, ctx)=>{
    ctx?.electric.bodyCoreWood.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.electric.bodyCoreWood.get()
  }}
  type="image"
/>