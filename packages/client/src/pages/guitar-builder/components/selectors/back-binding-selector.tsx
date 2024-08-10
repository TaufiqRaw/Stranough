import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

export const BackBindingSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.bindings)}
  onClick={async(i, o, ctx)=>{
      ctx?.getSelectedCategoryObj()?.backBinding.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.getSelectedCategoryObj()?.backBinding.get();
  }}
  type="text"
  nullable={GuitarBuilder.nullableSelectedItem.common.backBinding}
  hasSelected={(ctx)=>ctx?.getSelectedCategoryObj()?.backBinding.get() !== undefined}
  onClear={(ctx)=>ctx?.getSelectedCategoryObj()?.backBinding.set(undefined)}
/>