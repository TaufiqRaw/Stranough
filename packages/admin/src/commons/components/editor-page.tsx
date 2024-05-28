import {
  JSX,
  Resource,
  Show,
  Suspense,
  createContext,
  createResource,
  createSignal,
  getOwner,
  onMount,
  useContext,
} from "solid-js";
import { Application, Assets } from "solid-pixi";
import { Color, Sprite, Texture, Application as pxApplication } from "pixi.js";
import { Viewport } from "./viewport";
import { createResizeObserver } from "@solid-primitives/resize-observer";
import {
  GuitarBodyTextureKeyType,
  GuitarModel,
  GuitarModelBodyKeyType,
} from "~/pages/model-editor/utils/types";
import { createSignalObject } from "../functions/signal-object.util";
import { guitarModelRepository } from "~/pages/model-editor/guitar-model.repository";
import { guitarModelToPresenter } from "~/pages/model-editor/utils/functions/guitar-model-to-presenter";
import { EditorPageContextType } from "../interfaces/editor-page-context-type";
import { ToggleableButton } from "./toggleable-button";

const EditorPageContext = createContext<
  EditorPageContextType<{
    target: () => Texture;
    defaultWood: () => Texture;
  }>
>();

export function EditorPage(props: {
  presenter: () => JSX.Element;
  editorGui: () => JSX.Element;
}) {
  const [appContainer, setAppContainer] = createSignal<HTMLDivElement | null>(
    null
  );
  const [app, setApp] = createSignal<pxApplication | null>(null);
  onMount(() => {
    createResizeObserver(appContainer, ({ width, height }, el) => {
      app()?.renderer.resize(width, height);
      if (!app()) return;
      app()!.canvas.style.width = width + "px";
      app()!.canvas.style.height = height + "px";
    });
  });

  const [id, setId] = createSignal<number>();

  const [selectedTexture, setSelectedTexture] =
    createSignal<GuitarBodyTextureKeyType>();
  const [selectedBody, setSelectedBody] =
    createSignal<GuitarModelBodyKeyType>();

  const [selectedModel] = createResource(id, async (i) => {
    return await guitarModelRepository.get(i, {
      owner: getOwner()!,
      selectedBody: selectedBody(),
      selectedBodyTexture: selectedTexture(),
    });
  });

  const isFront = createSignalObject<boolean>(true);

  const isShowModelPreview = createSignalObject<boolean>(false);

  const { selectedTexture: textures, spawnpoints } =
    guitarModelToPresenter(selectedModel);

  return (
    <div class="relative flex">
      <EditorPageContext.Provider
        value={{
          modelPreview: {
            id,
            setId,
            selectedModel,
            textures,
            spawnpoints,
            selectedTexture,
            selectedBody,
            setSelectedTexture,
            setSelectedBody,
            isShowModelPreview,
          },
          textures: {
            target: () => Texture.from("/assets/target.png"),
            defaultWood: () => Texture.from("/assets/alder.jpg"),
          },
          isFront,
        }}
      >
        <Suspense fallback={<div>Loading....</div>}>
          <div class="flex-grow relative" ref={setAppContainer}>
            <ToggleableButton
              class="absolute left-12 top-2 w-20 h-10 z-[1] bg-blue-300 text-white !border-blue-500"
              activeClass="!bg-blue-500"
              isActive={isFront.get()}
              onClick={() => isFront.set(!isFront.get())}
            >
              Front
            </ToggleableButton>
            <div class="absolute">
              <Show when={appContainer()}>
                <Application
                  antialias
                  uses={setApp}
                  resolution={1.5}
                  backgroundColor={new Color()}
                >
                  <Viewport>
                    <Assets
                      load={[["/assets/alder.jpg", "/assets/target.png"]]}
                    >
                      {props.presenter()}
                    </Assets>
                  </Viewport>
                </Application>
              </Show>
            </div>
          </div>
        </Suspense>
        {props.editorGui()}
      </EditorPageContext.Provider>
    </div>
  );
}

export function useEditorPageContext() {
  return useContext(EditorPageContext);
}
