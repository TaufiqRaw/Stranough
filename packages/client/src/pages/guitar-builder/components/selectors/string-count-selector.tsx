import { Show, createMemo } from "solid-js";
import { useGuitarBuilderContext } from "../../guitar-builder";
import { ItemSelector } from "../utils/item-selector";
import { GuitarBuilder } from "stranough-common";
import { GuardPage } from "../utils/guard-page";

export function StringCountSelector(){
  const selected = useGuitarBuilderContext()!;
  return <Show when={selected.guitarType.get()}
    fallback={<GuardPage 
      description="Pilih jenis gitar terlebih dahulu untuk melanjutkan"
      />}
  >
    <ItemSelector
      items={()=>{
        const type = selected.guitarType.get()!;
        const stringCounts = createMemo(()=>GuitarBuilder.asArray(GuitarBuilder.stringCounts[type]))
        return stringCounts;
      }}
      onClick={(count, o, ctx)=>{
        ctx.getSelectedCategoryObj()?.stringCount?.set(count.key as any);
        ctx.electric.bridge.set(undefined);
        ctx.electric.bridge2.set(undefined);
        ctx.getSelectedCategoryObj()?.nut.set(undefined);
        ctx.getSelectedCategoryObj()?.headstock.set(undefined);
      }}
      selected={(count, ctx)=>count.key === ctx.getSelectedCategoryObj()?.stringCount.get()}
      type="text"
    />
  </Show>
} 