import { createQuery } from "@tanstack/solid-query";
import { ItemSelector } from "../../utils/item-selector";
import { SelectorRequireComponent } from "../_selector-require-component";
import { Pickup } from "stranough-common";
import { pickupRepository } from "~/pages/admin/pickup-editor/pickup.repository";
import { createMemo } from "solid-js";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";

export const PickupSelector = (props: {
  pickupPosition : 'neck' | 'middle' | 'bridge',
})=><SelectorRequireComponent
  requires={[{
    message : "Pilih konfigurasi pickup terlebih dahulu",
    test : ctx=>ctx.electric.pickupConfiguration.get() !== undefined 
  }]}
>
  {(ctx)=><ItemSelector
    items={ ()=>{
      const pickupType = createMemo(()=>{
        const type = {...Pickup.pickupConfigurations['electric-bass'], ...Pickup.pickupConfigurations['electric-guitar']}[ctx.electric.pickupConfiguration.get()!];
        let position;
        switch(type.length){
          case 1:
            if(props.pickupPosition === 'bridge')
              position = 0;
            break;
          case 2:
            if(props.pickupPosition === 'neck')
              position = 0;
            else if(props.pickupPosition === 'bridge')
              position = 1;
            break;
          case 3:
            if(props.pickupPosition === 'neck')
              position = 0;
            else if(props.pickupPosition === 'middle')
              position = 1;
            else if(props.pickupPosition === 'bridge')
              position = 2;
            break;
        }
        if(position === undefined)
          throw new Error('Invalid pickup position');
        return type[position];
      });
      const pickups = createQuery(()=>({
        queryKey : pickupRepository.queryKey({
          limit : 100,
          page : 1,
          type : pickupType()
        }),
        queryFn : async ()=>await pickupRepository.index(1, {
          limit : 100,
          // stringCount : ctx.electric.stringCountValue(),
          type : pickupType()
        })
      }))
      const m = createMemo(()=>pickups.data?.map((data)=>{
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
        ctx?.electric[`${props.pickupPosition}Pickup`].set(data);
    }}
    selected={(item, ctx)=>{
      return item.key === ctx?.electric[`${props.pickupPosition}Pickup`].get()?.id.get();
    }}
    type="image"
  />}
</SelectorRequireComponent>