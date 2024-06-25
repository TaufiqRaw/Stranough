import { For, Show, batch, createMemo, createSignal } from "solid-js";
import { ServerEntities } from "stranough-server";
import { useEditorPageContext } from "./editor-page";
import { createQuery } from "@tanstack/solid-query";
import { ToggleableButton } from "./toggleable-button";
import { Button } from "./button";
import { EditorGuiGroup } from "./editor-gui";
import { serverImgUrl } from "../functions/server-img-url.util";
import { electricModelRepository } from "~/pages/admin/electric-model-editor/electric-model.repository";
export function ElectricModelPreviewExplorer() {
  const model = createMemo(()=>useEditorPageContext()?.modelPreview);
  const [isShowModelExplorer, setIsShowModelExplorer] = createSignal(false);
  return (
    <EditorGuiGroup>
      <div class="flex gap-2">
        <ToggleableButton
          isActive={!!model()?.isShowModelPreview.get()}
          onClick={() => {
            if (!model()?.selectedModel()) {
              setIsShowModelExplorer(true);
            } else {
              model()?.isShowModelPreview?.set((prev) => !prev);
            }
          }}
          class="flex-grow"
        >
          Model Preview
        </ToggleableButton>
        <Button
          class="w-14 h-14 border hover:border-white border-gray-500 rounded-md !bg-transparent overflow-hidden !p-0"
          onClick={() => setIsShowModelExplorer((p) => !p)}
        >
          <Show
            when={model()?.selectedModel()?.thumbnail.get()?.filename}
            fallback={<></>}
          >
            <img
              class="w-14 h-14 object-cover"
              src={serverImgUrl(
                model()?.selectedModel()?.thumbnail.get()?.filename,
                true
              )}
              alt=""
            />
          </Show>
        </Button>
      </div>
      <Show when={isShowModelExplorer()}>
        <GuitarModelExplorerMenu hide={() => setIsShowModelExplorer(false)} />
      </Show>
    </EditorGuiGroup>
  );
}

function GuitarModelExplorerMenu(props: { hide?: () => void }) {
  const model = createMemo(()=>useEditorPageContext()?.modelPreview);

  const [page, setPage] = createSignal(1);

  const models = createQuery(() => ({
    queryKey: electricModelRepository.queryKey({
      page: page(),
    }),
    queryFn: async () =>
      await electricModelRepository.index(page(), { deep: true }),
  }));

  return (
    <div class="flex flex-col gap-2 max-h-64 overflow-auto">
      <For each={models.data}>
        {(m) => (
          <ToggleableButton
            class="flex flex-col gap-2 items-center"
            isActive={model()?.selectedModel()?.id.get() === m.id}
            onClick={() => {
              if (model()?.selectedModel()?.id.get() === m.id) {
                model()?.isShowModelPreview.set(true);
                props.hide?.();
                return;
              }
              model()?.isShowModelPreview.set(true);
              model()?.setId(m.id);
              props.hide?.();
            }}
          >
            <span class="px-2">{m.name}</span>
          </ToggleableButton>
        )}
      </For>
    </div>
  );
}