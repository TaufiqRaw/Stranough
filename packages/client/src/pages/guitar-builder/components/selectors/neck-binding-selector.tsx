import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

export const NeckBindingSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.bindings)}
  onClick={async(i, o, ctx)=>{
      ctx?.getSelectedCategoryObj()?.neckBinding.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.getSelectedCategoryObj()?.neckBinding.get();
  }}
  type="text"
  nullable={GuitarBuilder.nullableSelectedItem.common.neckBinding}
  hasSelected={(ctx)=>ctx?.getSelectedCategoryObj()?.neckBinding.get() !== undefined}
  onClear={(ctx)=>ctx?.getSelectedCategoryObj()?.neckBinding.set(undefined)}
/>