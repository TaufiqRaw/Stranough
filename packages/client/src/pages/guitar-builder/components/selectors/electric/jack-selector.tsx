import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";

const jackImages : {[k in keyof typeof GuitarBuilder.jackTypes] : string} = {
  "top-plated" : "/assets/gui/jack/top-plated.jpg",
  side : "/assets/gui/jack/side.jpg",
  top : "/assets/gui/jack/top.jpg",
}

export const JackSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.jackTypes).map(k=>({
    ...k,
    thumbnailSrc : jackImages[k.key],
  }))}
  onClick={async(i, o, ctx)=>{
    ctx?.electric.jack.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.electric.jack.get()
  }}
  type="image"
/>