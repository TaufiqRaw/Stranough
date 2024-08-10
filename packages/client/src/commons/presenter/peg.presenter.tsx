import {
  Sprite as pxSprite,
  Container as pxContainer,
  FederatedMouseEvent,
  Point,
  Texture,
} from "pixi.js";
import {
  JSX,
  Show,
  Suspense,
  createContext,
  createEffect,
  mergeProps,
  onCleanup,
  useContext,
} from "solid-js";
import { Container, Sprite } from "solid-pixi";
import { createPixiTexture } from "~/commons/functions/create-texture";
import { Position } from "~/commons/interfaces/position";
import { useHeadstockContext } from "./headstock.presenter";
import { useGuitarBodyPresenterContext } from "./guitar-model/electric-model.presenter";
import { PegPresenterProps } from "./types";

type PrivateCtx = {
  isFront : ()=>boolean;
  forSlottedHeadstock : ()=>boolean;
  scale : ()=>number;
  clickable : PegPresenterProps['clickable'];
}
const privateContext = createContext<PrivateCtx>();

export function PegPresenter(_props: PegPresenterProps) {
  const guitarBodyCtx = useGuitarBodyPresenterContext();
  const props = mergeProps({ isFront: guitarBodyCtx?.isFront ?? (()=>true) }, _props);
  
  const selectedTex = {
    cap: createPixiTexture(() => props.texture?.cap),
    back: createPixiTexture(() => props.texture?.back),
    rod : createPixiTexture(() => props.texture?.rod),
  };

  return (
    <Show when={selectedTex.back() && selectedTex.cap()}>
      <Suspense>
        <privateContext.Provider value={{
          isFront: props.isFront as ()=>boolean,
          forSlottedHeadstock: ()=>props.forSlottedHeadstock ?? false,
          scale: ()=>props.scale ?? 1,
          clickable : props.clickable,
        }}>
          <PegCap 
          onCapClick={props.onCapClick}
          capTexture={selectedTex.cap()}
          pivot={props.pivot}
          >
            {props.children}
          </PegCap>
          <PegRod
            onClick={props.onRodClick}
            texture={selectedTex.rod()}
            pivot={props.rodPivot}
          >
            {props.rodChildren}
          </PegRod>
          <PegBack
            onClick={props.onBackClick}
            texture={selectedTex.back()}
            backPivot={props.backPivot}
          >
            {props.backChildren}
          </PegBack>
        </privateContext.Provider>
      </Suspense>
    </Show>
  );
}

function PegCap(props :{
  onCapClick?: (e: Point) => void;
  children?: JSX.Element;
  capTexture?: Texture | undefined;
  pivot?: Position | undefined;
}){
  const privateCtx = useContext(privateContext)!;
  const headstockCtx = useHeadstockContext();

  return <Show when={!(privateCtx.forSlottedHeadstock() && !(privateCtx.isFront()))}>
    <Container
      position={headstockCtx?.childSpawnPos ?? { x: 0, y: 0 }}
      rotation={headstockCtx?.childSpawnPos?.rotation ?? 0}
      zIndex={privateCtx.isFront() ? 2 : 0}
      interactive = {privateCtx.clickable?.() === 'cap'}
      uses={[
        (container) => {
          if(!props.onCapClick) return;

          function listener(e: FederatedMouseEvent) {
            const newPoint = container.toLocal(e.global);
            props.onCapClick!(newPoint);
          }

          container.on("pointerdown", listener);
          onCleanup(() => container.off("pointerdown", listener));
        },
      ]}
    >
      <Container
        scale={headstockCtx?.flipped?.() ? {
          x: -1,
          y: 1
        }: 1}
      >
        <Sprite
          pivot={props.pivot ?? { x: 0, y: 0 }}
          texture={props.capTexture ?? Texture.EMPTY}
          scale={privateCtx.scale() ?? 1}
        />
        {props.children}
      </Container>
    </Container>
  </Show>
} 

function PegBack(props :{
  backPivot?: Position;
  onClick?: (e: Point) => void;
  children?: JSX.Element;
  texture?: Texture;
}){
  const headstockCtx = useHeadstockContext();
  const privateCtx = useContext(privateContext)!;
  return  <Show when={!(privateCtx.forSlottedHeadstock() && privateCtx.isFront())}>
      <Container
      position={headstockCtx?.childSpawnPos ?? { x: 0, y: 0 }}
      rotation={headstockCtx?.childSpawnPos?.rotation ?? 0}
      zIndex={privateCtx.isFront() ? 0 : 2}
      interactive={privateCtx.clickable?.() === 'back'}
      uses={[
        (container) => {
          if(!props.onClick) return;

          function listener(e: FederatedMouseEvent) {
            const newPoint = container.toLocal(e.global);
            props.onClick!(newPoint);
          }

          container.on("pointerdown", listener);
          onCleanup(() => container.off("pointerdown", listener));
        },
      ]}
    >
      <Container
        scale={headstockCtx?.flipped?.() ? {
          x: -1,
          y: 1
        }: 1}
      >
        <Sprite
          pivot={props.backPivot ?? { x: 0, y: 0 }}
          texture={props.texture ?? Texture.EMPTY}
          scale={privateCtx.scale() ?? 1}
        />
        {props.children}
      </Container>
  </Container>
  </Show>
}

function PegRod(props : {
  pivot ?: Position;
  children?: JSX.Element;
  onClick?: (e: Point) => void;
  texture?: Texture;
}){
  const headstockCtx = useHeadstockContext();
  const privateCtx = useContext(privateContext)!;
  return  <Show when={privateCtx.forSlottedHeadstock()}>
      <Container
      position={headstockCtx?.childSpawnPos ? {
        x: headstockCtx.childSpawnPos.x + (headstockCtx.slottedRodOffset?.() ?? 20) * (headstockCtx.flipped?.() ? -1 : 1),
        y: headstockCtx.childSpawnPos.y,
      } : { x: 0, y: 0 }}
      rotation={headstockCtx?.childSpawnPos?.rotation ?? 0}
      zIndex={0}
      interactive={privateCtx.clickable?.() === 'rod'}
      uses={[
        (container) => {
          if(!props.onClick) return;

          function listener(e: FederatedMouseEvent) {
            const newPoint = container.toLocal(e.global);
            props.onClick!(newPoint);
          }

          container.on("pointerdown", listener);
          onCleanup(() => container.off("pointerdown", listener));
        },
      ]}
    >
      <Container
        scale={headstockCtx?.flipped?.() ? {
          x: -1,
          y: 1
        }: 1}
      >
        <Sprite
          pivot={props.pivot ?? { x: 0, y: 0 }}
          texture={props.texture ?? Texture.EMPTY}
          scale={privateCtx.scale() ?? 1}
        />
        {props.children}
      </Container>
  </Container>
</Show>
}