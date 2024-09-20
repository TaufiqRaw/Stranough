import { createQuery } from "@tanstack/solid-query";
import { ItemSelector } from "../utils/item-selector";
import { headstockRepository } from "~/pages/admin/headstock-editor/headstock.repository";
import { createMemo } from "solid-js";
import { useGuitarBuilderContext } from "../../guitar-builder";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";

//TODO : add guard when no string count or category selected
export const HeadstockSelector = ()=>{
  const ctx = useGuitarBuilderContext();

  return <ItemSelector
  items={()=>{
    const headstocks = createQuery(()=>({
      queryKey : headstockRepository.queryKey({
        limit : 100,
        page : 1,
        stringCount : ctx?.getSelectedCategoryObj()?.stringCountValue(),
      }),
      queryFn : async ()=>await headstockRepository.index(1, {
        limit : 100,
        stringCount : ctx?.getSelectedCategoryObj()?.stringCountValue(),
      })
    }))
    const m = createMemo(()=>headstocks.data?.map((model)=>{
      console.log(model)
      return {
        key : model.id,
        name : model.name,
        price : model.price,
        //@ts-ignore
        thumbnailSrc : serverImgUrl(model.thumbnail?.filename, true)
      }
    }))
    return m
  }} onClick={async(item, o, ctx)=>{
      const data = await headstockRepository.get(item.key as number, {
        owner : o,
      })
      ctx?.getSelectedCategoryObj()?.headstock.set(data);
      ctx?.getSelectedCategoryObj()?.peg.set(undefined);
  }}
  selected={(item, ctx)=>{
    return item.key === ctx?.getSelectedCategoryObj()?.headstock.get()?.id.get()
  }}
  type="image"
/>}