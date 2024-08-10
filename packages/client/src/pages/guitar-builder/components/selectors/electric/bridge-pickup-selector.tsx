import { createQuery } from "@tanstack/solid-query"
import { createMemo } from "solid-js"
import { ItemSelector } from "../../utils/item-selector"
import { bridgeRepository } from "~/pages/admin/bridge-editor/bridge.repository"
import { pickupRepository } from "~/pages/admin/pickup-editor/pickup.repository"
import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder"
import { Pickup } from "stranough-common"
import { SelectorRequireComponent } from "../_selector-require-component"

export const BridgePickupSelector = ()=><SelectorRequireComponent
  requires={[{
    message : "Pilih jenis pickup terlebih dahulu untuk melanjutkan",
    test : (ctx)=>ctx.electric.pickupConfiguration.get() !== undefined
  }]}
>
  {(ctx)=><ItemSelector
  items={()=>{
    const pickupType = createMemo(()=>Pickup.pickupConfigurations["electric-guitar"][ctx.electric.pickupConfiguration.get()!][0]);
    const bridgePickups = createQuery(()=>({
      queryKey : pickupRepository.queryKey({
        limit : 100,
        page : 1,
        type : pickupType(),
      }),
      queryFn : async ()=>await pickupRepository.index(1, {
        limit : 100,
        type : pickupType(),
      })
    }))
    const m = createMemo(()=>bridgePickups.data?.map((data)=>{
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
      const data = await pickupRepository.get(item.key as number, {
        owner : o,
      })
      ctx?.electric.bridgePickup.set(data);
  }}
  selected={(item, ctx)=>{
    return item.key === ctx?.getSelectedCategoryObj()?.peg.get()?.id.get()
  }}
  type="image"
/>}
</SelectorRequireComponent>