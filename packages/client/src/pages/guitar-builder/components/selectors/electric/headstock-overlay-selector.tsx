import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";

export const HeadstockOverlaySelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.headstockOverlay)
  //   .map(k=>({
  //   ...k,
  //   thumbnailSrc : inlayImages[k.key],
  // }))
}
  onClick={async(i, o, ctx)=>{
    ctx?.electric.headstockOverlay.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.electric.headstockOverlay.get()
  }}
  type="text"
  nullable 
  onClear={async(ctx)=>{
    ctx?.electric.headstockOverlay.set(undefined);
  }}
  hasSelected={(ctx)=>ctx?.electric.headstockOverlay.get() !== undefined}
/>