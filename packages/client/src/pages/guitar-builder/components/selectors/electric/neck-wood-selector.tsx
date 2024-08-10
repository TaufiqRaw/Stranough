import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";
import { Constants } from "~/constants";

export const NeckWoodSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.neckWoods).map(k=>({
    ...k,
    thumbnailSrc : Constants.woodUrl[k.key],
  }))}
  onClick={async(i, o, ctx)=>{
    ctx?.getSelectedCategoryObj()?.neckWood.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.getSelectedCategoryObj()?.neckWood.get()
  }}
  type="image"
/>