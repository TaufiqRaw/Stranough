import { For, Show, batch, createMemo, createSignal } from "solid-js";
import { ServerEntities } from "stranough-server";
import { useEditorPageContext } from "./editor-page";
import { createQuery } from "@tanstack/solid-query";
import { ToggleableButton } from "./toggleable-button";
import { Button } from "./button";
import { EditorGuiGroup } from "./editor-gui";
import { serverImgUrl } from "../functions/server-img-url.util";
import { electricModelRepository } from "~/pages/admin/electric-model-editor/electric-model.repository";
import { GuitarBody, GuitarModel } from "stranough-common";
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

  const [selectedCandidate, setSelectedCandidate] = createSignal<
    ServerEntities.ElectricGuitarModel | undefined
  >(undefined);

  const models = createQuery(() => ({
    queryKey: electricModelRepository.queryKey({
      page: page(),
    }),
    queryFn: async () =>
      await electricModelRepository.index(page(), { deep: true }),
  }));

  return (
    <div class="flex flex-col gap-2 max-h-64 overflow-auto">
      <Show when={!selectedCandidate()}>
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
                setSelectedCandidate(m);
                model()?.setSelectedBody(undefined);
                model()?.setSelectedTexture(undefined);
              }}
            >
              <span class="px-2">{m.name}</span>
            </ToggleableButton>
          )}
        </For>
      </Show>
      <Show when={selectedCandidate()}>
        <div class="border p-2 border-gray-500 flex flex-col gap-2 rounded-md">
          <span class="text-center">{selectedCandidate()!.name}</span>
          <Show when={!model()?.selectedBody()}>
            <div class="flex flex-col gap-2">
              <Button
                class="!bg-transparent border border-red-700 hover:border-red-500 w-full"
                onClick={() => setSelectedCandidate(undefined)}
              >
                Cancel
              </Button>
              {GuitarModel.bodyKeys.map((key) => (
                <Show when={selectedCandidate()![key]}>
                  <Button
                    class="!bg-transparent border border-gray-500 hover:border-gray-200 w-full"
                    onClick={() => model()?.setSelectedBody(key)}
                  >
                    {key}
                  </Button>
                </Show>
              ))}
            </div>
          </Show>
          <Show when={model()?.selectedBody() && !model()?.selectedTexture()}>
            <Button
              class="!bg-transparent border border-red-700 hover:border-red-500 w-full"
              onClick={() => {
                model()?.setSelectedBody(undefined);
              }}
            >
              Cancel
            </Button>
            {GuitarBody.contourKeys.map((k) => (
              <Show when={selectedCandidate()![model()?.selectedBody()!]![k]}>
                <Button
                  class="!bg-transparent border border-gray-500 hover:border-gray-200 w-full"
                  onClick={() => {
                    batch(() => {
                      model()?.setSelectedTexture(k);
                      model()?.setId(selectedCandidate()!.id);
                      model()?.isShowModelPreview.set(true);
                    });
                    setSelectedCandidate(undefined);
                    props.hide?.();
                  }}
                >
                  {k}
                </Button>
              </Show>
            ))}
          </Show>
        </div>
      </Show>
    </div>
  );
}