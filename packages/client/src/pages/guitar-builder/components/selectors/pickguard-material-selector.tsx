import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";
import { Constants } from "~/constants";
import { SelectorRequireComponent } from "./_selector-require-component";
import { createMemo } from "solid-js";

export const PickguardMaterialSelector = () => <SelectorRequireComponent
  requires={[{
    message : "Pilih bentuk dasar gitar terlebih dahulu", // this message should never be shown because if test true assistant-steps will skip this component
    test : (ctx)=>!!ctx.electric.guitarModel.get()?.selectedPickguard.get()
  }]}
>{
  (ctx)=><ItemSelector
    items={()=>{
      const pickguardSize = createMemo(()=>ctx.electric.guitarModel.get()?.selectedPickguard.get()?.type.get());
      const pickguards = createMemo(()=>GuitarBuilder.asArray(GuitarBuilder.pickguardMaterials).map(i=>({
        ...i,
        price : i.price[pickguardSize()!],
        thumbnailSrc : Constants.pickguardMaterial[i.key]
      })))
      return pickguards;
    }}
    onClick={async(i, o, ctx)=>{
      ctx?.getSelectedCategoryObj()?.pickguardMaterial.set(i.key)
    }}
    selected={(i, ctx)=>{
      return i.key === ctx?.getSelectedCategoryObj()?.pickguardMaterial.get()
    }}
    type="image"
    nullable={true}
    hasSelected={(ctx)=>ctx.electric.pickguardMaterial.get() !== undefined}
    onClear={(ctx)=>ctx.electric.pickguardMaterial.set(undefined)}
  />
}</SelectorRequireComponent>