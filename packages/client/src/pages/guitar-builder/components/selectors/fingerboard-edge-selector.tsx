import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

const fingerboardEdgeThumbs : {[key in keyof typeof GuitarBuilder.fingerboardEdge] : string} = {
  heavy : "/assets/gui/fingerboard-edge/heavy.png",
  semi : "/assets/gui/fingerboard-edge/semi.png",
  square : "/assets/gui/fingerboard-edge/square.png",
}

export const FingerboardEdgeSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.fingerboardEdge).map(i=>({
    ...i,
    thumbnailSrc : fingerboardEdgeThumbs[i.key]
  }))}
  onClick={(item, o, ctx)=>{
    ctx.getSelectedCategoryObj()?.fingerboardEdge.set(item.key);
  }}
  selected={(item, ctx)=>item.key === ctx.getSelectedCategoryObj()?.fingerboardEdge.get()}
  type="image"
/>