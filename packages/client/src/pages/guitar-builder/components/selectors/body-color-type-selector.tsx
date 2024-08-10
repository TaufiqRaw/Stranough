import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

const bodyColorTypeImages : {[key in keyof typeof GuitarBuilder.bodyColorType] : string} = {
  solid : "/assets/gui/body-color-types/solid.jpg",
  metallic : "/assets/gui/body-color-types/metallic.jpg",
  transparent : "/assets/gui/body-color-types/transparent.jpg",
}

export const BodyColorTypeSelector = (props : {
  type : 'top' | 'back'
})=><ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.bodyColorType).map(i=>({
    ...i,
    thumbnailSrc : bodyColorTypeImages[i.key]
  }))}
  onClick={(item, o, ctx)=>{
    ctx.getSelectedCategoryObj()?.[`${props.type}BodyColorType`].set(item.key);
  }}
  selected={(item, ctx)=>item.key === ctx.getSelectedCategoryObj()?.[`${props.type}BodyColorType`].get()}
  type="image"
  nullable
  onClear={(ctx)=>ctx.getSelectedCategoryObj()?.[`${props.type}BodyColorType`].set(undefined)}
  hasSelected={(ctx)=>ctx.getSelectedCategoryObj()?.[`${props.type}BodyColorType`].get() !== undefined}
/>