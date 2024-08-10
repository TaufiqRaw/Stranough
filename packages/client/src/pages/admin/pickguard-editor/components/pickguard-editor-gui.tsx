import { For, createMemo } from "solid-js";
import { EditorGui, EditorGuiGroup, keyboardMove } from "~/commons/components/editor-gui";
import ImageInput from "~/commons/components/image-input";
import { Button } from "~/commons/components/button";
import { NameDescriptionGroup } from "~/commons/components/name-description-group";
import { useGuitarPickguard } from "../pickguard-editor.page";
import { Checkbox } from "~/commons/components/checkbox";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { Option, Select } from "~/commons/components/select";
import { ServerEntities } from "stranough-server";
import { useEditorPageContext } from "~/commons/components/editor-page";
import { createQuery } from "@tanstack/solid-query";
import { electricModelRepository } from "../../electric-model-editor/electric-model.repository";
import { ElectricModelPreviewExplorer } from "~/commons/components/electric-model-preview-explorer";
import { PickguardConfig } from "stranough-common";

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
    <EditorGui onKeydown={(key, t)=>{
      switch(key){
        case 'ArrowUp' :
        case 'ArrowDown' :
        case 'ArrowLeft' :
        case 'ArrowRight' : {
          keyboardMove(key, t, (speed) => pickguard()?.getSelectedItem()?.set((prev) => ({
            x: ((prev?.x ?? 0) + speed.x),
            y: ((prev?.y ?? 0) + speed.y),
          })));
          break;
        }
        case 'x' : {
          pickguard()?.getSelectedItem()?.set((prev)=>({x : 0, y : prev?.y ?? 0}));
          break;
        }
        case 'Escape' : {
          pickguard()?.selectedItem.set();
          break;
        }
      }
    }}>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Pickguard</span>
      </EditorGuiGroup>
      <ElectricModelPreviewExplorer />
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
        <span class="text-sm -mt-1">Type</span>
        <Select onChange={type=>{
            pickguard()?.type.set(type as PickguardConfig.PickguardType);
          }}
          value={pickguard()?.type.get() ?? ''}
        >
          <For each={Object.values(PickguardConfig.PickguardType)}>
            {(type) => <Option value={type}>{type}</Option>}
          </For>
        </Select>
      </NameDescriptionGroup>
      <EditorGuiGroup>
        <ImageInput
          label="Texture"
          partType="pickguard"
          onError={(e) => console.error(e)}
          acceptedTypes="image/svg+xml"
          onLoad={(image) => {
            pickguard()?.texture.set(image);
          }}
          onRemove={() => {
            pickguard()?.texture.set(undefined);
          }}
          imageFilename={pickguard()?.texture.get()?.filename}
        />
        <span>Scale</span>
        <input
          type="range"
          value={pickguard()?.scale.get()}
          oninput={(e) => pickguard()?.scale.set(parseFloat(e.target.value))}
          step={0.01}
          min={0.25}
          max={2}
        />
      </EditorGuiGroup>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Points</span>
        <ToggleableButton
          isActive={pickguard()?.selectedItem?.get() === "pivot"}
          onClick={() => pickguard()?.selectedItem?.set("pivot")}
        >
          Pivot Point
        </ToggleableButton>
      </EditorGuiGroup>
      <Button class="mx-3 mt-5" onClick={pickguard()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}
