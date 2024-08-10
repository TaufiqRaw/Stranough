import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

// const trussRodTypeThumbs : {[key in typeof GuitarBuilder.TrussRodType[number]['key']] : string} = {
//   "2-way-action" : "/assets/gui/truss-rod-type/2-way-action.png",
//   "double-truss-rod" : "/assets/gui/truss-rod-type/double-truss-rod.png",
// }

export const TopBindingSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.bindings)}
  onClick={async(i, o, ctx)=>{
      ctx?.getSelectedCategoryObj()?.topBinding.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.getSelectedCategoryObj()?.topBinding.get();
  }}
  type="text"
  nullable={GuitarBuilder.nullableSelectedItem.common.topBinding}
  hasSelected={(ctx)=>ctx?.getSelectedCategoryObj()?.topBinding.get() !== undefined}
  onClear={(ctx)=>ctx?.getSelectedCategoryObj()?.topBinding.set(undefined)}
/>