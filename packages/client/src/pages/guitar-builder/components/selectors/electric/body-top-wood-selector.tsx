import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../../utils/item-selector";
import { Constants } from "~/constants";
import { SelectorRequireComponent } from "../_selector-require-component";

//TODO: allow not selecting a top wood when body type is solid

export const bodyTopWoodSelector = () => <SelectorRequireComponent
  requires={[{
    message : "Pilih jenis body terlebih dahulu",
    test : (ctx)=>ctx.electric.bodyType.get() !== undefined
  }]}
>
  { (ctx) => <ItemSelector
    items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.bodyTopWoods).map(w=>({
      ...w,
      thumbnailSrc : Constants.woodUrl[w.key],
    }))}
    onClick={(i, o, ctx)=>{
      ctx?.electric.bodyTopWood.set(i.key);
    }}
    selected={(i, ctx)=>{
      return i.key === ctx?.electric.bodyTopWood.get()
    }}
    type="image"
    nullable={ctx.electric.bodyType.get() === 'solid'}
    hasSelected={(ctx)=>ctx.electric.bodyTopWood.get() !== undefined}
    onClear={(ctx)=>ctx.electric.bodyTopWood.set(undefined)}
    />
  }
</SelectorRequireComponent>