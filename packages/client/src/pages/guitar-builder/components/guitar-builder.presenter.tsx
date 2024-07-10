import { useGuitarBuilderContext } from "../guitar-builder";
import { Accessor, JSX, Show, createContext, createEffect, createMemo } from "solid-js";
import { HeadstockPresenter } from "~/commons/presenter/headstock.presenter";
import { headstockToPresenter } from "~/pages/admin/headstock-editor/utils/headstock-to-presenter";
import { Container } from "solid-pixi";
import { useViewportContext } from "~/commons/components/viewport";
import createStoredSignal from "~/commons/functions/create-stored-signal";
import { Constants } from "~/constants";
import { GuitarModelSolidColorPresenter } from "~/commons/presenter/guitar-model/guitar-model-solid-color.presenter";
import { PegPresenter } from "~/commons/presenter/peg.presenter";
import { pegToPresenter } from "~/pages/admin/peg-editor.ts/utils/peg-to-presenter";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { toCommonPresenter } from "~/commons/functions/to-common-presenter";
import { GuitarBuilder, Pickup } from "stranough-common";
import { ElectricModelPresenter } from "~/commons/presenter/guitar-model/electric-model.presenter";
import { electricModelToPresenter } from "~/pages/admin/electric-model-editor/utils/functions/electric-model-to-presenter";
import { NeckPresenter } from "~/commons/presenter/neck.presenter";
import { DropShadowFilter } from "pixi-filters";

const dropShadowFilter = new DropShadowFilter({
  blur: 4,
  offset : {
    x : 0,
    y : 0
  },
  alpha: 0.2,
})

export function GuitarBuilderPresenter(props : {

}){
  const viewportCtx = useViewportContext();
  const guitarBuilderCtx = useGuitarBuilderContext()!;

  const isFront = createMemo(()=>viewportCtx?.isFront.get());

  const pickups = createMemo(()=>{
    const res = [] as ((()=>JSX.Element) | undefined)[];
    if(!guitarBuilderCtx?.pickupConfiguration.get()) return res;
    const pickupConfig = Pickup.labelToPickupConfiguration[guitarBuilderCtx!.pickupConfiguration.get()!]
    for(let i = 0; i < pickupConfig.length; i++){
      if(i === 0){
        if(pickupConfig.length === 1){
          res.push(guitarBuilderCtx.bridgePickup.get() ? ()=><CommonPresenter filter={dropShadowFilter}  {...toCommonPresenter(guitarBuilderCtx.bridgePickup.get()!)} /> : undefined)
        }else{
          res.push(guitarBuilderCtx.neckPickup.get() ? ()=><CommonPresenter filter={dropShadowFilter} {...toCommonPresenter(guitarBuilderCtx.neckPickup.get()!)} /> : undefined)
        }
      }else if(i === 1){
        if(pickupConfig.length === 2){
          res.push(guitarBuilderCtx.bridgePickup.get() ? ()=><CommonPresenter filter={dropShadowFilter} {...toCommonPresenter(guitarBuilderCtx.bridgePickup.get()!)} /> : undefined)
        }else {
          res.push(guitarBuilderCtx.middlePickup.get() ? ()=><CommonPresenter filter={dropShadowFilter} {...toCommonPresenter(guitarBuilderCtx.middlePickup.get()!)} /> : undefined)
        }
      }else {
        res.push(guitarBuilderCtx.bridgePickup.get() ? ()=><CommonPresenter filter={dropShadowFilter} {...toCommonPresenter(guitarBuilderCtx.bridgePickup.get()!)} /> : undefined)
      }
    }
    return res;
  })

  return  <Container position={{x:0, y : 100}}>
    <Container scale={{x: guitarBuilderCtx?.isLeftHanded.get() ? -1 : 1, y : 1}}>
      <ElectricModelPresenter
        isFront={isFront()}
        body={{
          ...electricModelToPresenter(()=>guitarBuilderCtx?.guitarModel.get()).body,
          coreWood : Constants.getWoodUrl(guitarBuilderCtx?.bodyCoreWood.get()),
          topWood : Constants.getWoodUrl(guitarBuilderCtx?.bodyTopWood.get()),
        }}
        colorOverlay={ 
          guitarBuilderCtx?.bodyColorType.get() === 'solid' 
            ? guitarBuilderCtx?.bodyColor.get() 
              ? ()=><GuitarModelSolidColorPresenter color={GuitarBuilder.solidColors[guitarBuilderCtx!.bodyColor.get() as keyof typeof GuitarBuilder.solidColors]} /> 
              : undefined
            : undefined
        }
        bridge={guitarBuilderCtx?.bridge.get() ? ()=><CommonPresenter {...toCommonPresenter(guitarBuilderCtx!.bridge.get()!)}/> : undefined}
        neckWood={Constants.getWoodUrl(guitarBuilderCtx?.neckWood.get())}
        spawnpoints={electricModelToPresenter(()=>guitarBuilderCtx?.guitarModel.get()).spawnpoints}
        knobs={guitarBuilderCtx?.knob.get() ? Array.from({length : 5}, (_,i)=>()=><CommonPresenter {...toCommonPresenter(guitarBuilderCtx?.knob.get()!)} />) : undefined}
        jack={{
          side : guitarBuilderCtx?.jack.get()?.isSide.get() === true ? ()=><CommonPresenter {...toCommonPresenter(guitarBuilderCtx.jack.get()!)}/> : undefined,
          top : guitarBuilderCtx?.jack.get()?.isSide.get() === false ? ()=><CommonPresenter {...toCommonPresenter(guitarBuilderCtx.jack.get()!)}/> : undefined,
        }}
        // @ts-ignore
        pickup={guitarBuilderCtx?.pickupConfiguration.get() && {
          type : Pickup.labelToPickupConfiguration[guitarBuilderCtx!.pickupConfiguration.get()!],
          items : pickups()
        }}
        fingerboard={ ()=>
          <NeckPresenter
            wood={Constants.getWoodUrl(guitarBuilderCtx?.neckWood.get())}
            headstock={ ()=>
            <HeadstockPresenter
              pegs={guitarBuilderCtx?.peg.get() ? Array.from({length : 10}, (_,i)=>()=><PegPresenter {...pegToPresenter(guitarBuilderCtx?.peg.get())} />) : undefined}
              {...headstockToPresenter(guitarBuilderCtx?.headstock.get())}
            />
          }
          /> 
        }
      />
    </Container>
  </Container>
}