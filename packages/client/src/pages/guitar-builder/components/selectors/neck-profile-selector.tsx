import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";
import { Constants } from "~/constants";

export const NeckProfileSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.neckProfiles).map(i=>({
    ...i,
    thumbnailSrc : Constants.neckProfileImages[i.key]
  }))}
  onClick={async(i, o, ctx)=>{
    ctx?.getSelectedCategoryObj()?.neckProfile.set(i.key)
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.getSelectedCategoryObj()?.neckProfile.get()
  }}
  type="image"
/>