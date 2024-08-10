import { Show, createEffect, createMemo } from "solid-js";
import { useGuitarBuilderContext } from "../guitar-builder";
import { MaskedContainer } from "~/commons/presenter/masked-container.presenter";
import { createPixiTexture } from "~/commons/functions/create-texture";
import { Constants } from "~/constants";
import { Sprite } from "solid-pixi";
import { Texture } from "pixi.js";

export function GuitarBuilderPickguardPresenter(){
  const guitarBuilderCtx = useGuitarBuilderContext()!;
  const model = createMemo(()=>guitarBuilderCtx.electric.guitarModel.get());
  const pickguard = createMemo(()=>model()?.selectedPickguard.get());
  const selectedMaterial = createMemo(()=>guitarBuilderCtx.getSelectedCategoryObj()?.pickguardMaterial.get());
  const selectedMaterialtexture = createPixiTexture(()=>selectedMaterial() 
    ? Constants.pickguardMaterial[selectedMaterial()!]
    : undefined
  , false);

  return <Show when={selectedMaterialtexture()}>
      <MaskedContainer 
        scale={pickguard()?.scale.get()}
        mask={pickguard()?.texture.get()?.filename}
        position={pickguard()?.pivotPosition.get()}
        interactive
      >
        {({ maskTexture }) => {
          const scaleToMask = createMemo(()=>((maskTexture()?.height ?? 1) * (pickguard()?.scale.get() ?? 1)) / (selectedMaterialtexture()?.height ?? 1));
          return <Sprite
            texture={selectedMaterialtexture() ?? Texture.EMPTY}
            scale={scaleToMask()}
          />
        }}
      </MaskedContainer>
    </Show>
};