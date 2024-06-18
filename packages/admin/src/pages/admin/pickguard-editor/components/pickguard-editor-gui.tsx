import { For, createMemo } from "solid-js";
import { EditorGui, EditorGuiGroup, keyboardMove } from "~/commons/components/editor-gui";
import ImageInput from "~/commons/components/image-input";
import { Button } from "~/commons/components/button";
import { GuitarModelPreviewExplorer } from "~/commons/components/guitar-model-preview-explorer";
import { NameDescriptionGroup } from "~/commons/components/name-description-group";
import { useGuitarPickguard } from "../pickguard-editor.page";
import { Checkbox } from "~/commons/components/checkbox";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { Option, Select } from "~/commons/components/select";
import { ServerEntities } from "stranough-server";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { createQuery } from "@tanstack/solid-query";
import { electricModelRepository } from "../../electric-model-editor/electric-model.repository";

export function PickguardEditorGui() {
  const pickguard = createMemo(() => useGuitarPickguard().get());
  const model = createMemo(()=>useEditorPageContext()?.modelPreview);

  const models = createQuery(() => ({
    queryKey: electricModelRepository.queryKey({
      limit : 9999,
    }),
    queryFn: async () =>
      await electricModelRepository.index(1, { deep: true, limit : 9999 }),
  }));

  return (
    <EditorGui>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Pickguard</span>
      </EditorGuiGroup>
      <NameDescriptionGroup
        description={pickguard()?.description}
        name={pickguard()?.name}
        placeholder={pickguard()?.placeholder}
        price={pickguard()?.price}
      >
        <span class="text-sm -mt-1">Model</span>
        <Select onChange={_id=>{
          const id = parseInt(_id);
          if(isNaN(id)) return;
          model()?.setId(id);
          model()?.isShowModelPreview.set(true);
          pickguard()?.model.set(id);
        }}
          value={(pickguard()?.model.get() ?? '')  + ""}
        >
          <For each={models.data}>
            {({id, name})=>(
              <Option value={id + ""}>{name}</Option>
            )}
          </For>
        </Select>
      </NameDescriptionGroup>
      <EditorGuiGroup>
        <ImageInput
          label="Texture"
          partType="pickguard"
          onError={(e) => console.error(e)}
          onLoad={(image) => {
            pickguard()?.texture.set(image);
          }}
          onRemove={() => {
            pickguard()?.texture.set(undefined);
          }}
          imageFilename={pickguard()?.texture.get()?.filename}
        />
      </EditorGuiGroup>
      <Button class="mx-3 mt-5" onClick={pickguard()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}
