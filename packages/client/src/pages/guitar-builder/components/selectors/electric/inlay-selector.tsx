import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";

const inlayImages : {[k in keyof typeof GuitarBuilder.inlayTypes] : string} = {
  "abalone-dot" : "/assets/gui/inlay/abalone-dot.jpg",
  "glow-in-the-dark-dot" : "/assets/gui/inlay/glow-in-the-dark-dot.jpg",
  // "mother-of-pearl-dot" : "/assets/gui/inlay/mother-of-pearl-dot.jpg",
  "pearloid-dot" : "/assets/gui/inlay/pearloid-dot.jpg",
  "pearloid-block" : "/assets/gui/inlay/pearloid-block.jpg",
  "pvc-dot" : "/assets/gui/inlay/pvc-dot.jpg",
}

export const InlaySelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.inlayTypes).map(k=>({
    ...k,
    thumbnailSrc : inlayImages[k.key],
  }))}
  onClick={async(i, o, ctx)=>{
    ctx?.electric.inlay.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.electric.inlay.get()
  }}
  type="image"
/>