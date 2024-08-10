import { Show, createMemo } from "solid-js";
import { useGuitarBuilderContext } from "../guitar-builder";
import { createPixiTexture } from "~/commons/functions/create-texture";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { Graphics, Sprite } from "solid-pixi";
import { IGuitarBuilder } from "../utils/types";

const jackTextures = {
  top : "/assets/jack/top.png",
  "top-plated" : "/assets/jack/top-plated.png",
  side : undefined,
}

export function createGuitarBuilderJackHook(ctx : IGuitarBuilder){
  const jack = createMemo(()=>ctx?.electric.jack.get());
  const jackTexture = createPixiTexture(()=>jack() ? jackTextures[jack()!] : undefined, false)
  const jackRenderable = createMemo(()=>{
    if(!jack())
      return undefined;
    if(jack() === 'side')
      return {
        side : ()=><Graphics
          draw={[
            ['rect', -5, -5, 10, 10],
            ['fill', 0xD9D9D9]
          ]}
        />
      }
    else
      return {
        top : ()=><Sprite 
          texture={jackTexture()} 
          anchor={jack() === 'top-plated' ? {x:0.5, y:0.9} : {x:0.5, y:0.5}}
          scale={jack() === 'top-plated' ? 0.4 : 0.5}
        />
      }
  })
  return jackRenderable;
}