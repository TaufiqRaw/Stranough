import { Show } from "solid-js";
import { MaskedBodyPresenter, NeckThroughToFullMaskedPresenter, useGuitarBodyPresenterContext } from "./electric-model.presenter";
import { Graphics, RenderedGraphics } from "solid-pixi";
import { Color } from "pixi.js";

export function GuitarModelSolidColorPresenter(props : {
  color : number | Color,
}){
  const model = useGuitarBodyPresenterContext()
  return <>
    <Show when={model?.type?.() !== 'neckThroughConstruction'}>
      <MaskedBodyPresenter>
        { (mask)=> <RenderedGraphics
          draw={[
            ['rect', 0,0, mask()?.width ?? 0, mask()?.height ?? 0],
            ['fill', props.color]
          ]}
          anchor={0.5}
        />
        }
      </MaskedBodyPresenter>
    </Show>
    <Show when={model?.type?.() === 'neckThroughConstruction'}>
      <NeckThroughToFullMaskedPresenter>
        { (mask)=> <RenderedGraphics
            draw={[
              ['rect', 0,0, mask()?.width ?? 0 , mask()?.height ?? 0],
              ['fill', props.color]
            ]}
            anchor={0.5}
        />}
      </NeckThroughToFullMaskedPresenter>
    </Show>
  </>
}