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
  ElectricModel,
  GuitarModelBodyKeyType,
} from "~/pages/admin/electric-model-editor/utils/types";
import { createSignalObject } from "../functions/signal-object.util";
import { guitarModelToPresenter } from "~/pages/admin/electric-model-editor/utils/functions/guitar-model-to-presenter";
import { EditorPageContextType } from "../interfaces/common-context-type";
import { ToggleableButton } from "./toggleable-button";
import { headstockRepository } from "~/pages/admin/headstock-editor/headstock.repository";
import { electricModelRepository } from "~/pages/admin/electric-model-editor/electric-model.repository";

const EditorPageContext = createContext<
  EditorPageContextType
>();

export function EditorPage(props: {
  presenter: () => JSX.Element;
  editorGui: () => JSX.Element;
}) {
  const [selectedTexture, setSelectedTexture] =
  createSignal<GuitarBodyTextureKeyType>();
  const [selectedBody, setSelectedBody] =
  createSignal<GuitarModelBodyKeyType>();
  
  const [modelId, setModelId] = createSignal<number>();
  const [selectedModel] = createResource(modelId, async (i) => {
    return await electricModelRepository.get(i, {
      owner: getOwner()!,
      selectedBody: selectedBody(),
    });
  });

  const [headstockId, setHeadstockId] = createSignal<number>();
  const [selectedHeadstock] = createResource(headstockId, async (i) => {
    return await headstockRepository.get(i, {
      owner : getOwner()!
    });
  })

  const isShowModelPreview = createSignalObject<boolean>(false);
  const isShowHeadstockPreview = createSignalObject<boolean>(false);

  return (
    <div class="relative flex">
      <EditorPageContext.Provider
        value={{
          modelPreview: {
            id: modelId,
            setId: setModelId,
            selectedModel,
            selectedTexture,
            selectedBody,
            setSelectedTexture,
            setSelectedBody,
            isShowModelPreview,
          },
          headstockPreview : {
            id: headstockId,
            setId: setHeadstockId,
            selectedHeadstock,
            isShowHeadstockPreview,
          },
        }}
      >
        <Suspense fallback={<div>Loading....</div>}>
          <div class="flex-grow relative">
            <Viewport>
              {props.presenter()}
            </Viewport>
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
