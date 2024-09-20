import { useGuitarBuilderContext } from "./guitar-builder";
import { Accessor, JSX, Setter, Show, createContext, createEffect, createMemo } from "solid-js";
import { HeadstockPresenter } from "~/commons/presenter/headstock.presenter";
import { headstockToPresenter } from "~/pages/admin/headstock-editor/utils/headstock-to-presenter";
import { Container, Graphics, Sprite } from "solid-pixi";
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
import { ElecticModelPresenterProps } from "~/commons/presenter/types";
import { MaskedContainer } from "~/commons/presenter/masked-container.presenter";
import { Texture } from "pixi.js";
import { createPixiTexture } from "~/commons/functions/create-texture";
import { GuitarBuilderPickguardPresenter } from "./presenter/guitar-builder-pickguard-presenter";
import { GuitarBuilderNutPresenter } from "./presenter/guitar-builder-nut-presenter";
import { createGuitarBuilderBridgeHook } from "./presenter/guitar-builder-bridge-hook";
import { GuitarBuilderBodyColorPresenter } from "./presenter/guitar-builder-body-color-presenter";
import { createGuitarBuilderPickupHook } from "./presenter/guitar-builder-pickup-hook";
import { createGuitarBuilderJackHook } from "./presenter/guitar-builder-jack-hook";

export function GuitarBuilderPresenter(props : {
  setOnRender? : Setter<any>
}){
  const viewportCtx = useViewportContext();
  const guitarBuilderCtx = useGuitarBuilderContext()!;

  const isFront = createMemo(()=>viewportCtx?.isFront.get());

  const electricModelPresenter = createMemo(()=>electricModelToPresenter(()=>guitarBuilderCtx.electric.guitarModel.get())); 
  const bridge = createGuitarBuilderBridgeHook();

  const pickups = createGuitarBuilderPickupHook(guitarBuilderCtx);
  const jack = createGuitarBuilderJackHook(guitarBuilderCtx);

  return  <Container position={{x:0, 
    y : 0
  }}>
    <Container scale={{x: guitarBuilderCtx.orientation.get() === 'left-handed' ? -1 : 1, y : 1}}>
      <ElectricModelPresenter
        setOnRender={props.setOnRender}
        isFront={isFront()}
        {...electricModelPresenter()}
        body={{
          ...electricModelPresenter().body,
          coreWood : Constants.getWoodUrl(guitarBuilderCtx.electric.bodyCoreWood.get()),
          topWood : Constants.getWoodUrl(guitarBuilderCtx.electric.bodyTopWood.get()),
        }}
        spawnpoints={electricModelPresenter().spawnpoints}
        mirrorHole={electricModelPresenter().mirrorHole}
        holeScale={electricModelPresenter().holeScale}
        pickup={guitarBuilderCtx.electric.pickupConfiguration.get() && {
          type : pickups.config(),
          items : pickups.renderable()
        } as ElecticModelPresenterProps['pickup']}
        bridge={bridge()}
        neckWood={Constants.getWoodUrl(guitarBuilderCtx.electric.neckWood.get())}
        knobs={guitarBuilderCtx.electric.knob.get() ? Array.from({length : 5}, (_,i)=>()=><CommonPresenter {...toCommonPresenter(guitarBuilderCtx.electric.knob.get()!)} />) : undefined}
        jack={jack()}
        colorOverlay={GuitarBuilderBodyColorPresenter}
        pickguard={GuitarBuilderPickguardPresenter}
        stringCount={guitarBuilderCtx.electric.stringCountValue}
        fingerboard={ ()=>
          <NeckPresenter
            stringCount={guitarBuilderCtx.electric.stringCountValue}
            wood={Constants.getWoodUrl(guitarBuilderCtx.electric.neckWood.get())}
            fretCount={guitarBuilderCtx.electric.fretCountValue}
            fingerboardWood={Constants.getWoodUrl(guitarBuilderCtx.getSelectedCategoryObj()?.fingerboardWood.get())}
            nut={GuitarBuilderNutPresenter}
            headstock={ ()=>
            <HeadstockPresenter
              pegs={guitarBuilderCtx.electric.peg.get() ? Array.from({length : 10}, (_,i)=>()=><PegPresenter {...pegToPresenter(guitarBuilderCtx.electric.peg.get())} />) : undefined}
              {...headstockToPresenter(guitarBuilderCtx.electric.headstock.get())}
            />
          }
          /> 
        }
      />
    </Container>
  </Container>
}