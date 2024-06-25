import { useGuitarBuilderContext } from "../guitar-builder";
import { Accessor, Show, createContext, createEffect, createMemo } from "solid-js";
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
import { GuitarBuilder } from "stranough-common";
import { ElectricModelPresenter } from "~/commons/presenter/guitar-model/electric-model.presenter";
import { electricModelToPresenter } from "~/pages/admin/electric-model-editor/utils/functions/electric-model-to-presenter";
import { NeckPresenter } from "~/commons/presenter/neck.presenter";

export function GuitarBuilderPresenter(props : {

}){
  const viewportCtx = useViewportContext();
  const selectedGuitarComponent = useGuitarBuilderContext();

  const isFront = createMemo(()=>viewportCtx?.isFront.get());

  return  <Container position={{x:0, y : 100}}>
    <Container scale={{x: selectedGuitarComponent?.isLeftHanded.get() ? -1 : 1, y : 1}}>
      <ElectricModelPresenter
        isFront={isFront()}
        body={{
          ...electricModelToPresenter(()=>selectedGuitarComponent?.guitarModel.get()).body,
          coreWood : Constants.getWoodUrl(selectedGuitarComponent?.bodyCoreWood.get()),
          topWood : Constants.getWoodUrl(selectedGuitarComponent?.bodyTopWood.get()),
        }}
        colorOverlay={ 
          selectedGuitarComponent?.bodyColorType.get() === 'solid' 
            ? selectedGuitarComponent?.bodyColor.get() 
              ? ()=><GuitarModelSolidColorPresenter color={GuitarBuilder.solidColors[selectedGuitarComponent!.bodyColor.get() as keyof typeof GuitarBuilder.solidColors]} /> 
              : undefined
            : undefined
        }
        bridge={selectedGuitarComponent?.bridge.get() ? ()=><CommonPresenter {...toCommonPresenter(selectedGuitarComponent!.bridge.get()!)}/> : undefined}
        neckWood={Constants.getWoodUrl(selectedGuitarComponent?.neckWood.get())}
        spawnpoints={electricModelToPresenter(()=>selectedGuitarComponent?.guitarModel.get()).spawnpoints}
        knobs={selectedGuitarComponent?.knob.get() ? Array.from({length : 5}, (_,i)=>()=><CommonPresenter {...toCommonPresenter(selectedGuitarComponent?.knob.get()!)} />) : undefined}
        jack={{
          side : selectedGuitarComponent?.jack.get()?.isSide.get() === true ? ()=><CommonPresenter {...toCommonPresenter(selectedGuitarComponent.jack.get()!)}/> : undefined,
          top : selectedGuitarComponent?.jack.get()?.isSide.get() === false ? ()=><CommonPresenter {...toCommonPresenter(selectedGuitarComponent.jack.get()!)}/> : undefined,
        }}
        fingerboard={ ()=>
          <NeckPresenter
            wood={Constants.getWoodUrl(selectedGuitarComponent?.neckWood.get())}
            headstock={ ()=>
            <HeadstockPresenter
              pegs={selectedGuitarComponent?.peg.get() ? Array.from({length : 10}, (_,i)=>()=><PegPresenter {...pegToPresenter(selectedGuitarComponent?.peg.get())} />) : undefined}
              {...headstockToPresenter(selectedGuitarComponent?.headstock.get())}
            />
          }
          /> 
        }
      />
    </Container>
  </Container>
}