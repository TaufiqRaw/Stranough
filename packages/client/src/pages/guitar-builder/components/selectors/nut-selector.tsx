import { createQuery } from "@tanstack/solid-query"
import { ItemSelector } from "../utils/item-selector"
import { Show, createMemo } from "solid-js"
import { useGuitarBuilderContext } from "../../guitar-builder";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { nutRepository } from "~/pages/admin/nut-editor/nut.repository";
import { SelectorRequireComponent } from "./_selector-require-component";

export const NutSelector = ()=> <SelectorRequireComponent
  requires={[{
    message : "Pilih jenis gitar terlebih dahulu",
    test : (ctx)=>ctx.guitarType.get() !== undefined
  }, {
    message : "Pilih jumlah senar terlebih dahulu",
    test : (ctx)=>ctx.getSelectedCategoryObj()?.stringCount.get() !== undefined
  }]}
>
{ (ctx)=><ItemSelector
    items={()=>{
      const nuts = createQuery(()=>({
        queryKey : nutRepository.queryKey({
          limit : 100,
          page : 1,
          stringCount : ctx.getSelectedCategoryObj()!.stringCountValue(),
        }),
        queryFn : async ()=>await nutRepository.index(1, {
          limit : 100,
          stringCount : ctx.getSelectedCategoryObj()!.stringCountValue(),
        })
      }))
      const m = createMemo(()=>nuts.data?.map((data)=>{
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
        const data = await nutRepository.get(item.key as number, {
          owner : o,
        })
        ctx?.getSelectedCategoryObj()?.nut.set(data);
    }}
    selected={(item, ctx)=>{
      return item.key === ctx?.getSelectedCategoryObj()?.nut.get()?.id.get()
    }}
    type="image"
  />}
</SelectorRequireComponent>