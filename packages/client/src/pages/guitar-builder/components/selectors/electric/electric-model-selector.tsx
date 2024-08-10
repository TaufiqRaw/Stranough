import { createQuery } from "@tanstack/solid-query";
import { ItemSelector } from "../../utils/item-selector";
import { electricModelRepository } from "~/pages/admin/electric-model-editor/electric-model.repository";
import { Show, createMemo } from "solid-js";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { SelectorRequireComponent } from "../_selector-require-component";

export const ElectricModelSelector = ()=><SelectorRequireComponent
  requires={[{
    message : "pilih jenis gitar terlebih dahulu",
    test : (ctx)=>ctx.guitarType.get() !== undefined
  }]}
>
    {(ctx)=><ItemSelector items={
      ()=>{
        const electricModels = createQuery(()=>({
          queryKey : electricModelRepository.queryKey({
            limit : 100,
            page : 1,
            isBass : ctx.guitarType.get()! === 'electric-bass'
          }),
          queryFn : async ()=>await electricModelRepository.index(1, {
            limit : 100,
            deep : true,
          })
        }))
        const m = createMemo(()=>electricModels.data?.map((model)=>{
          return {
            key : model.id,
            name : model.name,
            price : model.price,
            //@ts-ignore
            thumbnailSrc : serverImgUrl(model.thumbnail?.filename, true)
          }
        }))
        return m
      }} onClick={async(model, o, ctx)=>{
          const modelData = await electricModelRepository.get(model.key as number, {
            owner : o,
          })
          ctx?.electric.guitarModel.set(modelData);
          ctx?.electric.constructionMethod.set(modelData?.selectedConstruction.get() ?? undefined);
          ctx?.electric.topContour.set(modelData?.selectedTopContour.get() ?? undefined);
          ctx?.electric.backContour.set(modelData?.selectedBackContour.get() ?? undefined);
      }}
      selected={(model, ctx)=>{
        return model.key === ctx?.electric.guitarModel.get()?.id.get()
      }}
      type="image"
    />}
</SelectorRequireComponent>