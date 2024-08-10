import { Position } from "~/commons/interfaces/position";
import { useGuitarBuilderContext } from "../guitar-builder";
import { For, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { Container } from "solid-pixi";
import { useGuitarBodyPresenterContext } from "~/commons/presenter/guitar-model/electric-model.presenter";
import { IGuitarBuilder } from "../utils/types";

export function GuitarBuilderRegisterStringSpawnpoints(props: { 
  spawnpoints: ()=>(Position | undefined)[],
  type : keyof Omit<IGuitarBuilder['stringSpawnpoints'], 'fromTop'>
}) {
  const guitarBuilderCtx = useGuitarBuilderContext();
  const indexedSpawnpoints = createMemo(()=>props.spawnpoints().map((sp, i)=>(sp ? {...sp, index : i} : undefined)));
  const guitarBodyCtx = useGuitarBodyPresenterContext();
  const bodyContainer = createMemo(()=>guitarBodyCtx?.container());

  onCleanup(()=>{
    guitarBuilderCtx?.stringSpawnpoints[props.type].forEach(sp=>sp?.set(undefined));
  })
  
  return <Show when={bodyContainer() && guitarBuilderCtx}> 
    <For each={indexedSpawnpoints()}>
      {(sp)=> <Show when={sp && guitarBodyCtx?.isFront()}>
        <Container
          position={sp}
          uses={p=>{
            if(bodyContainer() === undefined) return;
            const newPoint = bodyContainer()!.toLocal(bodyContainer()!.position!, p);
            guitarBuilderCtx?.stringSpawnpoints[props.type][sp!.index]?.set(newPoint);
          }}
        />
      </Show>}
    </For>
  </Show>
}