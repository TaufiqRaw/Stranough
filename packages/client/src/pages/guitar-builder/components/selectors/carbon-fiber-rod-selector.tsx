import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

export const CarbonFiberRodSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.binaryOptions)}
  onClick={async(i, o, ctx)=>{
      ctx?.getSelectedCategoryObj()?.carbonFiberRod.set(i.key === 'yes');
  }}
  selected={(i, ctx)=>{
    return i.key === (ctx?.getSelectedCategoryObj()?.carbonFiberRod.get() ? 'yes' : 'no' ) ;
  }}
  type="text"
/>