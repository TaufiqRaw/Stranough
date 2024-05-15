import { createResizeObserver } from "@solid-primitives/resize-observer";
import { useParams } from "@solidjs/router";
import { Show, createSignal, onMount } from "solid-js";
import { Color, Application as pxApplication} from 'pixi.js'
import { Application } from "solid-pixi";
import { Viewport } from "~/commons/components/viewport";

function BridgeEditor(){
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

  return <div class="relative flex">
      <div class="flex-grow relative" ref={setAppContainer}>
        <div class="absolute">
          <Show when={appContainer()}>
            <Application antialias uses={setApp} resolution={1.5} backgroundColor={new Color()}>
              <Viewport>
                <Presenter/>
              </Viewport>
            </Application>
          </Show>
        </div>
      </div>
      <UserGui/>
  </div>
}

export default BridgeEditor;