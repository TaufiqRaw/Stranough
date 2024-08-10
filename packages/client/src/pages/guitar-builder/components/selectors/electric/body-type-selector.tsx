import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";
import { Constants } from "~/constants";

export const bodyTypeSelector = () => <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.electricBodyTypes)}
  onClick={(i, o, ctx)=>{
    ctx?.electric.bodyType.set(i.key);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.electric.bodyType.get()
  }}
  type="text"
/>