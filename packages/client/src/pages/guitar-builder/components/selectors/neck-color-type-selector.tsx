import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

// const neckColorTypeImages : {[key in keyof typeof GuitarBuilder.bodyColorType] : string} = {
//   solid : "/assets/gui/neck-color-types/solid.jpg",
//   metallic : "/assets/gui/neck-color-types/metallic.jpg",
//   transparent : "/assets/gui/neck-color-types/transparent.jpg",
// }

export const NeckColorTypeSelector = ()=><ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.neckColorType)
  //   .map(i=>({
  //   ...i,
  //   thumbnailSrc : neckColorTypeImages[i.key]
  // }))
}
  onClick={(item, o, ctx)=>{
    ctx.getSelectedCategoryObj()?.neckColorType.set(item.key);
  }}
  selected={(item, ctx)=>item.key === ctx.getSelectedCategoryObj()?.neckColorType.get()}
  type="text"
  nullable
  onClear={(ctx)=>ctx.getSelectedCategoryObj()?.neckColorType.set(undefined)}
  hasSelected={(ctx)=>ctx.getSelectedCategoryObj()?.neckColorType.get() !== undefined}
/>