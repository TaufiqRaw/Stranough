import { createQuery } from "@tanstack/solid-query"
import { pegRepository } from "~/pages/admin/peg-editor.ts/peg.repository"
import { createMemo } from "solid-js"
import { ItemSelector } from "../../utils/item-selector"
import { knobRepository } from "~/pages/admin/knob-editor/knob.repository"
import { serverImgUrl } from "~/commons/functions/server-img-url.util"

export const KnobSelector = ()=><ItemSelector
  items={()=>{
    const knobs = createQuery(()=>({
      queryKey : knobRepository.queryKey({
        limit : 100,
        page : 1,
      }),
      queryFn : async ()=>await knobRepository.index(1, {
        limit : 100,
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
      const data = await knobRepository.get(item.key as number, {
        owner : o,
      })
      ctx?.electric.knob.set(data);
  }}
  selected={(item, ctx)=>{
    return item.key === ctx?.electric.knob.get()?.id.get()
  }}
  type="image"
/>