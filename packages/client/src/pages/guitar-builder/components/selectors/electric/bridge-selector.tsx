import { createQuery } from "@tanstack/solid-query"
import { batch, createMemo } from "solid-js"
import { ItemSelector } from "../../utils/item-selector"
import { bridgeRepository } from "~/pages/admin/bridge-editor/bridge.repository"
import { SelectorRequireComponent } from "../_selector-require-component"
import { Bridge } from "stranough-common"
import { serverImgUrl } from "~/commons/functions/server-img-url.util"

export const BridgeSelector = ()=><SelectorRequireComponent
  requires={[{
    message : "Pilih jenis gitar terlebih dahulu",
    test : (ctx)=>ctx.guitarType.get() !== undefined
  },{
    message : "Pilih jumlah senar terlebih dahulu",
    test : (ctx)=>ctx.electric?.stringCount.get() !== undefined
  }]}
>
  {ctx=><ItemSelector
  items={()=>{
    const bridges = createQuery(()=>({
      queryKey : bridgeRepository.queryKey({
        limit : 100,
        page : 1,
        isBass : ctx.electric.guitarModel.get()?.isBass.get(),
        stringCount : ctx.electric.stringCountValue(),
      }),
      queryFn : async ()=>await bridgeRepository.index(1, {
        limit : 100,
        isBass : ctx.electric.guitarModel.get()?.isBass.get(),
        stringCount : ctx.electric.stringCountValue(),
      })
    }))
    const m = createMemo(()=>bridges.data?.map((data)=>{
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
      const lastBridge = ctx.electric.bridge.get();
      if(lastBridge && [`${Bridge.BridgeType.Tailpiece}`, `${Bridge.BridgeType.NearTailpiece}`].includes(lastBridge.type.get()!)){
        ctx.stringSpawnpoints.tailpiece.forEach(sp=>sp?.set(undefined));
      }else{
        ctx.stringSpawnpoints.bridge.forEach(sp=>sp?.set(undefined));
      }
      const data = await bridgeRepository.get(item.key as number, {
        owner : o,
      })
      ctx?.electric.bridge.set(undefined);
      setTimeout(()=>{
        batch(()=>{
          ctx?.electric.bridge.set(data);
          ctx?.electric.bridge2.set(undefined);
        });
      }, 100);
  }}
  selected={(item, ctx)=>{
    return item.key === ctx?.electric.bridge.get()?.id.get()
  }}
  type="image"
/>}
</SelectorRequireComponent>

export const Bridge2Selector = ()=><SelectorRequireComponent
  requires={[{
    message : "Pilih jenis gitar terlebih dahulu",
    test : (ctx)=>ctx.guitarType.get() !== undefined
  },{
    message : "Pilih jumlah senar terlebih dahulu",
    test : (ctx)=>ctx.electric?.stringCount.get() !== undefined
  },{
    message : "Pilih bridge terlebih dahulu",
    test : (ctx)=>ctx.electric?.bridge.get() !== undefined
  }]}
  >
  {ctx=><ItemSelector
    items={()=>{
      const bridge1type = createMemo(()=>ctx.electric.bridge.get()!.type.get()!)
      //first bridge either tailpiece or tuneomatic, if not this selector should be disabled or skipped
      const isTailpiece = createMemo(()=>[`${Bridge.BridgeType.Tailpiece}`, `${Bridge.BridgeType.NearTailpiece}`].includes(bridge1type()))
      const bridges = createQuery(()=>({
        queryKey : bridgeRepository.queryKey({
          limit : 100,
          page : 1,
          isBass : ctx.electric.guitarModel.get()?.isBass.get(),
          stringCount : ctx.electric.stringCountValue(),
          // if first bridge is tailpiece, then show only tuneomatic and vice versa
          type : isTailpiece() ? 'tuneomatic' : 'tailpiece'
        }),
        queryFn : async ()=>await bridgeRepository.index(1, {
          limit : 100,
          isBass : ctx.electric.guitarModel.get()?.isBass.get(),
          stringCount : ctx.electric.stringCountValue(),
          type : isTailpiece() ? 'tuneomatic' : 'tailpiece'
        })
      }))
      const m = createMemo(()=>bridges.data?.map((data)=>{
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
        const data = await bridgeRepository.get(item.key as number, {
          owner : o,
        })
        ctx.electric.bridge2.set(undefined);
        setTimeout(()=>{
          ctx?.electric.bridge2.set(data);
        }, 100);
    }}
    selected={(item, ctx)=>{
      return item.key === ctx?.electric.bridge2.get()?.id.get()
    }}
    type="image"
  />}
</SelectorRequireComponent>