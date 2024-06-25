import { Container, Sprite } from "solid-pixi";
import { FederatedMouseEvent, Texture, Sprite as pxSprite } from "pixi.js";
import { createPixiTexture } from "../functions/create-texture";
import { Accessor, JSX, createSignal, onCleanup } from "solid-js";
import { Position } from "../interfaces/position";

export function MaskedContainer(
  props : {
    scale ?: number,
    pivot ?: Position,
    interactive ?: boolean,
    onClick ?: (p : Position)=>void,
    mask ?: string,
    children : (props : {
      maskSprite : Accessor<pxSprite | undefined>,
      maskTexture : Accessor<Texture | undefined>
    })=>JSX.Element
  }
){
  const maskTexture = createPixiTexture(()=>props.mask);
  const [maskSprite, setMaskSprite] = createSignal<pxSprite | undefined>(undefined);
  return <Container
    mask={maskSprite()}
    onclick={e=>{
      
    }}
    interactive={props.interactive}
    uses={[
      (container) => {
        if(!props.onClick) return;

        function listener(e: FederatedMouseEvent) {
          const newPoint = container.toLocal(e.global);
          props.onClick!(newPoint);
        }

        container.on("pointerdown", listener);
        onCleanup(() => container.off("pointerdown", listener));
      }
    ]}
  >
    <Sprite
      uses={setMaskSprite}
      texture={maskTexture() ?? Texture.EMPTY}
      alpha={0.5}
      pivot={props.pivot ?? { x: 0, y: 0 }}
      scale={props.scale ?? 1}
    />
    {props.children({
      maskSprite,
      maskTexture
    })}
  </Container>
}