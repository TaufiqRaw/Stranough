import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

export const FingerboardEdgeSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.fingerboardEdge)}
  onClick={(item, o, ctx)=>{
    ctx.getSelectedCategoryObj()?.fingerboardEdge.set(item.key);
  }}
  selected={(item, ctx)=>item.key === ctx.getSelectedCategoryObj()?.fingerboardEdge.get()}
  type="text"
/>