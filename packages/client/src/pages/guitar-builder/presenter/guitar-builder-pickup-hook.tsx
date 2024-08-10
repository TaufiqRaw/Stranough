import { JSX, createMemo } from "solid-js";
import { IGuitarBuilder } from "../utils/types";
import { Pickup } from "stranough-common";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { DropShadowFilter } from "pixi-filters";
import { toCommonPresenter } from "~/commons/functions/to-common-presenter";

const dropShadowFilter = new DropShadowFilter({
  blur: 4,
  offset : {
    x : 0,
    y : 0
  },
  alpha: 0.2,
})

const BRIDGE_ROTATE = 0.261799; 

export function createGuitarBuilderPickupHook(ctx : IGuitarBuilder){
  const config = createMemo(()=>(ctx.electric.pickupConfiguration.get() 
    ? {...Pickup.pickupConfigurations['electric-bass'], ...Pickup.pickupConfigurations['electric-guitar']}[ctx.electric.pickupConfiguration.get()!] 
    : undefined));
  
  const renderable = createMemo(()=>{
    const res = [] as ((()=>JSX.Element) | undefined)[];
    if(config() === undefined) return res;
    
    for(let i = 0; i < config()!.length; i++){
      if(i === 0){
        if(config()!.length === 1){
          res.push(ctx.electric.bridgePickup.get() ? ()=><CommonPresenter filter={dropShadowFilter}  {...toCommonPresenter(ctx.electric.bridgePickup.get()!)} /> : undefined)
        }else{
          res.push(ctx.electric.neckPickup.get() ? ()=><CommonPresenter filter={dropShadowFilter} {...toCommonPresenter(ctx.electric.neckPickup.get()!)} /> : undefined)
        }
      }else if(i === 1){
        if(config()!.length === 2){
          res.push(ctx.electric.bridgePickup.get() ? ()=><CommonPresenter 
            rotation={ctx.electric.pickupConfiguration.get() === 'S-S' ? BRIDGE_ROTATE : 0}
            filter={dropShadowFilter} 
            {...toCommonPresenter(ctx.electric.bridgePickup.get()!)} /> : undefined)
        }else {
          res.push(ctx.electric.middlePickup.get() ? ()=><CommonPresenter
            filter={dropShadowFilter} {...toCommonPresenter(ctx.electric.middlePickup.get()!)} /> : undefined)
        }
      }else {
        res.push(ctx.electric.bridgePickup.get() ? ()=><CommonPresenter
          rotation={ctx.electric.pickupConfiguration.get() === 'S-S-S' ? BRIDGE_ROTATE : 0}
          filter={dropShadowFilter} {...toCommonPresenter(ctx.electric.bridgePickup.get()!)} /> : undefined)
      }
    }
    return res;
  })

  return {
    config,
    renderable
  }
}