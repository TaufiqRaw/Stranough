import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

// const trussRodTypeThumbs : {[key in typeof GuitarBuilder.TrussRodType[number]['key']] : string} = {
//   "2-way-action" : "/assets/gui/truss-rod-type/2-way-action.png",
//   "double-truss-rod" : "/assets/gui/truss-rod-type/double-truss-rod.png",
// }

export const TrussRodTypeSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.TrussRodType)}
  onClick={async(i, o, ctx)=>{
      ctx?.getSelectedCategoryObj()?.trussRodType.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.getSelectedCategoryObj()?.trussRodType.get();
  }}
  type="text"
/>