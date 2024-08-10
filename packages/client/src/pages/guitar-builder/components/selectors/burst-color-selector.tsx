import { Colors, GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";

export const BurstColorSelector = ()=><ItemSelector
  items={()=>()=>GuitarBuilder.asArray(Colors.burstColors).map(i=>{
    const value = GuitarBuilder.getValue(Colors.burstColors, i.key)!.map(c=>c.toString(16).padStart(6, '0'));
    console.log(value);
    return ({
    ...i,
    price : (value.length - 1) * 50000,
    imgBtnChild : ()=><div
      class="w-full h-full"
      style={{"background-image" : `linear-gradient(90deg, ${value.length > 1 ? `#${value[0]}, #${value[1]}` : `#${value[0]}, #${value[0]}`})`}}
    />
  })})}
  onClick={(item, o, ctx)=>{
    ctx.getSelectedCategoryObj()?.burstColor.set(item.key);
  }}
  selected={(item, ctx)=>item.key === ctx.getSelectedCategoryObj()?.burstColor.get()}
  type="image"
/>