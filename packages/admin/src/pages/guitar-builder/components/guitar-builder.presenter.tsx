import { GuitarModelPresenter } from "~/commons/presenter/guitar-model.presenter";
import { useSelectedGuitarComponent } from "../guitar-builder";
import { Show, createEffect, createMemo } from "solid-js";
import { guitarModelToPresenter } from "~/pages/admin/model-editor/utils/functions/guitar-model-to-presenter";
import { FingerboardPresenter } from "~/commons/presenter/fingerboard.presenter";
import { HeadstockPresenter } from "~/commons/presenter/headstock.presenter";
import { headstockToPresenter } from "~/pages/admin/headstock-editor/utils/headstock-to-presenter";
import { Container } from "solid-pixi";
import { useViewportContext } from "~/commons/components/viewport";

export function GuitarBuilderPresenter(props : {

}){
  const viewportCtx = useViewportContext();
  const selectedGuitarComponent = useSelectedGuitarComponent();

  const isFront = createMemo(()=>viewportCtx?.isFront.get());

  return  <Container position={{x:0, y : 100}}>
    <Container scale={{x: selectedGuitarComponent?.isLeftHanded.get() ? -1 : 1, y : 1}}>
      <GuitarModelPresenter
        isFront={isFront()}
        {...guitarModelToPresenter(()=>selectedGuitarComponent?.guitarModel.get())}
        fingerboard={ ()=>
          <FingerboardPresenter
            isFront={isFront()}
            headstock={ ()=>
            <HeadstockPresenter 
              isFront={isFront()}
              {...headstockToPresenter(selectedGuitarComponent?.headstock.get())}
            />
          }
          /> 
        }
      />
    </Container>
  </Container>
}