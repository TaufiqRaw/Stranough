import { createQuery } from "@tanstack/solid-query"
import { ItemSelector } from "../utils/item-selector"
import { pegRepository } from "~/pages/admin/peg-editor.ts/peg.repository"
import { Show, createMemo } from "solid-js"
import { useGuitarBuilderContext } from "../../guitar-builder";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";

export function PegSelector(){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const headstock = createMemo(()=>guitarBuilderCtx.getSelectedCategoryObj()?.headstock.get());

  return <Show when={headstock()}
    fallback={<div class="text-center text-gray-400">Pilih headstock terlebih dahulu</div>}
  >
    <ItemSelector
      items={()=>{
        const pegs = createQuery(()=>({
          queryKey : pegRepository.queryKey({
            limit : 100,
            page : 1,
            forSlottedHeadstock : headstock()?.isSlotted.get(),
          }),
          queryFn : async ()=>await pegRepository.index(1, {
            limit : 100,
            forSlottedHeadstock : headstock()?.isSlotted.get(),
          })
        }))
        const m = createMemo(()=>pegs.data?.map((data)=>{
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
          const data = await pegRepository.get(item.key as number, {
            owner : o,
          })
          ctx?.getSelectedCategoryObj()?.peg.set(data);
      }}
      selected={(item, ctx)=>{
        return item.key === ctx?.getSelectedCategoryObj()?.peg.get()?.id.get()
      }}
      type="image"
    />
  </Show> 
}