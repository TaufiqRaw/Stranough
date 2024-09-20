import { createQuery } from "@tanstack/solid-query";
import { ItemSelector } from "../../utils/item-selector";
import { SelectorRequireComponent } from "../_selector-require-component";
import { pickguardRepository } from "~/pages/admin/pickguard-editor/pickguard.repository";
import { createMemo } from "solid-js";

const PickguardSelector = () => <SelectorRequireComponent
  requires={[{
    message : "Pilih body gitar terlebih dahulu.",
    test : (ctx)=>ctx.electric.guitarModel.get() !== undefined
  }]}>
  { (ctx) => <ItemSelector
    items={()=>{
      const knobs = createQuery(()=>({
        queryKey : pickguardRepository.queryKey({
          limit : 100,
          page : 1,
          model : ctx.electric.guitarModel.get()?.id.get()
        }),
        queryFn : async ()=>await pickguardRepository.index(1, {
          limit : 100,
          model : ctx.electric.guitarModel.get()!.id.get()
        })
      }))
      const m = createMemo(()=>knobs.data?.map((data)=>{
        return {
          key : data.id,
          name : data.name,
          price : data.price,
          //@ts-ignore
          thumbnailSrc : serverImgUrl(data.thumbnail?.filename, true)
        }
      }))
      return m
    }} onClick={async(item, o, ctx)=>{
        const data = await pickguardRepository.get(item.key as number, {
          owner : o,
        })
        ctx?.electric.pickguard.set(data)
    }}
    selected={(item, ctx)=>{
      return item.key === ctx?.electric.knob.get()?.id.get()
    }}
    type="image"
  />

  }
</SelectorRequireComponent>