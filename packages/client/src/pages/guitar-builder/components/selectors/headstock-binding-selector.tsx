import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

export const HeadstockBindingSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.bindings)}
  onClick={async(i, o, ctx)=>{
      ctx?.getSelectedCategoryObj()?.headstockBinding.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.getSelectedCategoryObj()?.headstockBinding.get();
  }}
  type="text"
  nullable={GuitarBuilder.nullableSelectedItem.common.headstockBinding}
/>