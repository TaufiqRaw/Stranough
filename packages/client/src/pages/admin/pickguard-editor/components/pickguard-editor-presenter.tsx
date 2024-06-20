import { For, Show, createMemo } from "solid-js";
import { Graphics, Sprite } from "solid-pixi";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { Position } from "~/commons/interfaces/position";
import { Constants } from "~/constants";
import { useGuitarPickguard } from "../pickguard-editor.page";
import { CommonPresenter } from "~/commons/presenter/common.presenter";
import { Texture } from "pixi.js";
import { useViewportContext } from "~/commons/components/viewport";
import { GuitarModelPresenter } from "~/commons/presenter/guitar-model/guitar-model.presenter";
import { guitarModelToPresenter } from "../../electric-model-editor/utils/functions/guitar-model-to-presenter";

export function JackEditorPresenter() {
  const pickguard = createMemo(() => useGuitarPickguard().get());
  const viewportCtx = useViewportContext();
  const editorCtx = useEditorPageContext();

  return (
    <Show
      when={
        editorCtx?.modelPreview.isShowModelPreview.get() &&
        editorCtx?.modelPreview.selectedModel()
      }
    >
      <GuitarModelPresenter
        {...guitarModelToPresenter(editorCtx!.modelPreview.selectedModel)}
        pickguard={()=>pickguard()?.texture.get()?.filename}
      />
    </Show>
  );
}
