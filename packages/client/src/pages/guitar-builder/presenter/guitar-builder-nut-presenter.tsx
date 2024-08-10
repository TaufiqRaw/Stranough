import { Show, createMemo } from "solid-js";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { useGuitarBuilderContext } from "../guitar-builder";
import { GuitarBuilderRegisterStringSpawnpoints } from "./guitar-builder-string-presenter";

export function GuitarBuilderNutPresenter(){
  const guitarBuilderCtx = useGuitarBuilderContext();
  const nut = createMemo(() => guitarBuilderCtx?.getSelectedCategoryObj()?.nut.get());
  return <Show when={nut()}>
      <CommonPresenter
        texture={nut()?.texture.get()?.filename}
        pivot={nut()?.pivotPosition.get()}
        scale={nut()?.scale.get()}
        onClick={(p) => {
          if (nut()?.selectedItem.get() === "pivot") {
            nut()?.pivotPosition.set((prev) => {
              if (!prev)
                return {
                  x: p.x,
                  y: p.y,
                };
              return {
                x: prev.x + p.x,
                y: prev.y + p.y,
              };
            });
          } else nut()?.getSelectedItem()?.set(p);
        }}
    >
      <Show when={nut()?.stringSpawnPoint.state()}>
        <GuitarBuilderRegisterStringSpawnpoints spawnpoints={()=>nut()?.stringSpawnPoint.state().map(s=>s.get())!} type="nut"/>
      </Show>
    </CommonPresenter>
  </Show>
}