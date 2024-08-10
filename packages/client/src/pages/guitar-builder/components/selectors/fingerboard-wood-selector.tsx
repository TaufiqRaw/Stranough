import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";
import { Constants } from "~/constants";

export const FingerboardWoodSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.fingerboardWoods).map(w=>({
    ...w,
    thumbnailSrc : Constants.woodUrl[w.key],
  }))}
  onClick={(i, o, ctx)=>{
    ctx?.getSelectedCategoryObj()?.fingerboardWood.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.getSelectedCategoryObj()?.fingerboardWood.get()
  }}
  type="image"
/>