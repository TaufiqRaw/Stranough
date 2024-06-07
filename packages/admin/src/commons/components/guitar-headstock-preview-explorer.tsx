import { For, Show, batch, createMemo, createSignal } from "solid-js";
import { ServerEntities } from "stranough-server";
import { useEditorPageContext } from "./editor-page";
import { createQuery } from "@tanstack/solid-query";
import { guitarModelRepository } from "~/pages/admin/model-editor/guitar-model.repository";
import { ToggleableButton } from "./toggleable-button";
import { Button } from "./button";
import { guitarBodyTextureKey, guitarModelBodyKey } from "~/pages/admin/model-editor/utils/constant";
import { EditorGuiGroup } from "./editor-gui";
import { serverImgUrl } from "../functions/server-img-url.util";
import { headstockRepository } from "~/pages/admin/headstock-editor/headstock.repository";

export function GuitarHeadstockPreviewExplorer() {
  const headstock = createMemo(()=>useEditorPageContext()?.headstockPreview);
  const [isShowModelExplorer, setIsShowModelExplorer] = createSignal(false);
  return (
    <EditorGuiGroup>
      <div class="flex gap-2">
        <ToggleableButton
          isActive={!!headstock()?.isShowHeadstockPreview.get()}
          onClick={() => {
            if (!headstock()?.selectedHeadstock()) {
              setIsShowModelExplorer(true);
            } else {
              headstock()?.isShowHeadstockPreview?.set((prev) => !prev);
            }
          }}
          class="flex-grow"
        >
          Headstock Preview
        </ToggleableButton>
        <Button
          class="w-14 h-14 border hover:border-white border-gray-500 rounded-md !bg-transparent"
          onClick={() => setIsShowModelExplorer((p) => !p)}
        >
          <Show
            when={headstock()?.selectedHeadstock()?.thumbnail.get()?.filename}
            fallback={<></>}
          >
            <img
              class="w-14 h-14 object-cover"
              src={serverImgUrl(
                headstock()?.selectedHeadstock()?.thumbnail.get()?.filename,
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
  const headstock = createMemo(()=>useEditorPageContext()?.headstockPreview);

  const [page, setPage] = createSignal(1);

  const models = createQuery(() => ({
    queryKey: headstockRepository.queryKey({
      page: page(),
    }),
    queryFn: async () =>
      await headstockRepository.index(page()),
  }));

  return (
    <div class="flex flex-col gap-2 max-h-64 overflow-auto">
      <For each={models.data}>
        {(m) => (
          <ToggleableButton
            class="flex flex-col gap-2 items-center"
            isActive={headstock()?.selectedHeadstock()?.id.get() === m.id}
            onClick={() => {
              if (headstock()?.selectedHeadstock()?.id.get() === m.id) {
                headstock()?.isShowHeadstockPreview.set(true);
                props.hide?.();
                return;
              }
              headstock()?.setId(m.id);
              headstock()?.isShowHeadstockPreview.set(true);
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