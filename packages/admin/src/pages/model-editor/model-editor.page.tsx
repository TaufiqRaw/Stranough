import { useParams } from "@solidjs/router";
import { Application as pxApplication, Color, Graphics as pxGraphic} from "pixi.js";
import { JSX, Show, createEffect, createMemo, createSignal, on, onMount } from "solid-js";
import { Application, Graphics } from "solid-pixi";
import UserGui from "./components/user-gui";
import { Viewport } from "~/commons/components/viewport";
import { GuitarModelSignalProvider, useGuitarModelSignal } from "~/pages/model-editor/guitar-model.context";
import { ModelPresenter } from "./components/model-presenter";
import { createResizeObserver, createWindowSize } from "@solid-primitives/resize-observer";
import { Assets } from "solid-pixi";
import { guitarBodyTextureKey, guitarBodyTextureMediaKey, guitarModelBodyKey } from "./utils/constant";
import { serverImgUrl } from "~/commons/functions/server-img-url.util";

export default function ModelEditor() {
  const [appContainer, setAppContainer] = createSignal<HTMLDivElement | null>(null)
  const [app, setApp] = createSignal<pxApplication | null>(null)
  const params = useParams();
  const id = parseInt(params.id);

  onMount(()=>{
    createResizeObserver(appContainer, ({width, height}, el)=>{
      app()?.renderer.resize(width, height);
      if(!app()) return;
      app()!.canvas.style.width = width + 'px';
      app()!.canvas.style.height = height + 'px';
    })
  });

  return <GuitarModelSignalProvider id={id}>
    <div class="relative flex">
      <div class="flex-grow relative" ref={setAppContainer}>
        <div class="absolute">
          <Show when={appContainer()}>
            <Application antialias uses={setApp} resolution={1.5} backgroundColor={new Color()}>
              <Viewport>
                <Assets load={[['/assets/alder.jpg', '/assets/fingerboard.png']]}>
                  <ModelPresenter/>
                </Assets>
              </Viewport>
            </Application>
          </Show>
        </div>
      </div>
      <UserGui/>
    </div>
  </GuitarModelSignalProvider>
}