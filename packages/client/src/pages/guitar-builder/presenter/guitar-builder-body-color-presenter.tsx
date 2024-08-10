import { Show, createMemo } from "solid-js";
import { useGuitarBuilderContext } from "../guitar-builder";
import { MaskedBodyPresenter, useGuitarBodyPresenterContext } from "~/commons/presenter/guitar-model/electric-model.presenter";
import { Container, Graphics, Sprite } from "solid-pixi";
import { createPixiTexture } from "~/commons/functions/create-texture";
import { Constants } from "~/constants";
import { Colors } from "stranough-common";
import { Texture } from "pixi.js";

export function GuitarBuilderBodyColorPresenter(){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const guitarBodyCtx = useGuitarBodyPresenterContext()!;

  const topBodyColorType = createMemo(()=>guitarBuilderCtx.getSelectedCategoryObj()?.topBodyColorType.get());
  const _topBodyColor = createMemo(()=>guitarBuilderCtx.getSelectedCategoryObj()?.topBodyColor.get());
  const backBodyColorType = createMemo(()=>guitarBuilderCtx.getSelectedCategoryObj()?.backBodyColorType.get());
  const _backBodyColor = createMemo(()=>guitarBuilderCtx.getSelectedCategoryObj()?.backBodyColor.get());

  const topBodyColor = createMemo(()=>{
    if(_topBodyColor() === undefined) return undefined;
    switch(topBodyColorType()){
      case 'solid' :
      case 'transparent' : 
        return Colors.solidColors[_topBodyColor()! as keyof typeof Colors.solidColors].value
      case 'metallic' :
        return Constants.metallicColorUrl[_topBodyColor()! as keyof typeof Colors.metallicColors]
    }
  });
  const backBodyColor = createMemo(()=>{
    if(_backBodyColor() === undefined) return undefined;
    switch(backBodyColorType()){
      case 'solid' :
      case 'transparent' : 
        return Colors.solidColors[_backBodyColor()! as keyof typeof Colors.solidColors].value
      case 'metallic' :
        return Constants.metallicColorUrl[_backBodyColor()! as keyof typeof Colors.metallicColors]
    }
  });

  const topTexture = createPixiTexture(()=>typeof topBodyColor() === 'string' ? topBodyColor() as string : undefined, false);
  const backTexture = createPixiTexture(()=>typeof backBodyColor() === 'string' ? backBodyColor() as string : undefined, false);

  return <Show when={guitarBodyCtx.isFront()}
    fallback={
      <Show when={backBodyColorType() && backBodyColor()}>
        <MaskedBodyPresenter>
          {(m)=><Show when={typeof backBodyColor() === 'string'}
            fallback={
              <Graphics
              draw={[
                ['rect', 
                  -(m()?.width ?? 0)/2,
                  -(m()?.height ?? 0)/2,
                  m()?.width ?? 0, m()?.height ?? 0],
                ['fill', backBodyColor() ?? 0x00000]
              ]}
              alpha={backBodyColorType() === 'transparent' ? 0.6 : 1}
            />
            }
          >
            <Sprite
              anchor={0.5}
              texture={backTexture() ?? Texture.EMPTY}
              width={m()?.width}
              height={m()?.height}
            />
          </Show>}
        </MaskedBodyPresenter>
      </Show>
    }
  >
    <Show when={topBodyColorType() && topBodyColor()}>
      <MaskedBodyPresenter>
        {(m)=><Show when={typeof topBodyColor() === 'string'}
          fallback={
            <Graphics
            draw={[
              ['rect', 
                -(m()?.width ?? 0)/2,
                -(m()?.height ?? 0)/2,
                m()?.width ?? 0, m()?.height ?? 0],
              ['fill', topBodyColor() ?? 0x00000]
            ]}
            alpha={topBodyColorType() === 'transparent' ? 0.6 : 1}
          />
          }
        >
          <Sprite
            anchor={0.5}
            texture={topTexture() ?? Texture.EMPTY}
            width={m()?.width}
            height={m()?.height}
          />
        </Show>}
      </MaskedBodyPresenter>
    </Show>
  </Show>
}