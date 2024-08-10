import { For, Show, createMemo } from "solid-js";
import { EditorGui, EditorGuiGroup, keyboardMove } from "~/commons/components/editor-gui";
import ImageInput from "~/commons/components/image-input";
import { Button } from "~/commons/components/button";
import { NameDescriptionGroup } from "~/commons/components/name-description-group";
import { useAcousticGuitarModel } from "../acoustic-guitar-model-editor.page";
import { Checkbox } from "~/commons/components/checkbox";
import { ToggleableButton } from "~/commons/components/toggleable-button";
import { ElectricModelPreviewExplorer } from "~/commons/components/electric-model-preview-explorer";
import { AcousticModel } from "stranough-common";
import ToggleableButtonWithState from "~/commons/components/toggleable-button-with-state";
import { SpawnPointType } from "../../electric-model-editor/utils/types";
import { Constants } from "~/constants";
import { Range } from "~/commons/components/range";

export function AcousticModelEditorGui() {
  const model = createMemo(() => useAcousticGuitarModel().get());

  return (
    <EditorGui onKeydown={(key, t)=>{
      switch(key){
        case 'ArrowUp' :
        case 'ArrowDown' :
        case 'ArrowLeft' :
        case 'ArrowRight' : {
          keyboardMove(key, t, (speed) => model()?.spawnPoints.getSelectedSignal()?.set((prev) => ({
            x: ((prev?.x ?? 0) + speed.x),
            y: ((prev?.y ?? 0) + speed.y),
          })));
          break;
        }
        case 'x' : {
          model()?.spawnPoints.getSelectedSignal()?.set((prev)=>({x : 0, y : prev?.y ?? 0}));
          break;
        }
        case 'Escape' : {
          model()?.spawnPoints.selected.set();
          break;
        }
      }
    }}>
      <EditorGuiGroup parent>
        <span class="font-bold text-center mx-3">Acoustic model</span>
      </EditorGuiGroup>
      <ElectricModelPreviewExplorer />
      <NameDescriptionGroup
        description={model()?.description}
        name={model()?.name}
        placeholder={model()?.placeholder}
        price={model()?.price}
        thumbnail={model()?.thumbnail}
      >
        <ImageInput
          label={<span class="text-sm">Normal Mask</span>}
          imageFilename={
            model()?.normalMask.get()?.filename
          }
          acceptedTypes="image/svg+xml"
          onLoad={(id) => model()?.normalMask.set(id)}
          onRemove={() => model()?.normalMask.set(null)}
          partType={"body"}
        />
        <ImageInput
          label={<span class="text-sm">Beveled Mask</span>}
          imageFilename={
            model()?.beveledMask.get()?.filename
          }
          acceptedTypes="image/svg+xml"
          onLoad={(id) => model()?.beveledMask.set(id)}
          onRemove={() => model()?.beveledMask.set(null)}
          partType={"body"}
        />
        <span>Scale</span>
        <input
          type="range"
          value={model()?.maskScale.get()}
          oninput={(e) => model()?.maskScale.set(parseFloat(e.target.value))}
          step={0.01}
          min={0.25}
          max={2}
        />
        <ToggleableButton
            isActive={!!model()?.isBeveled.get()}
            onClick={() => {
              model()?.isBeveled.set((prev) => !prev);
            }}
          >
            Preview Beveled
          </ToggleableButton>
      </NameDescriptionGroup>
      <EditorGuiGroup parent>
          <span class="font-bold text-center mx-3">Cutaway</span>
      </EditorGuiGroup>
      <EditorGuiGroup>
        <For each={AcousticModel.cutawayKeys}>
          { key => <ToggleableButton
            isActive={model()?.selectedCutaway.get() + "Cutaway" === key}
            onClick={() => {
              model()?.selectedCutaway.set(key.replace('Cutaway', '') as any);
            }}
          >
              {key}
            </ToggleableButton>
          }
        </For>
      </EditorGuiGroup>
      <EditorGuiGroup>
        <For each={AcousticModel.cutawayKeys}>
          { key => <>
            <span class="text-sm -mt-1">{key}</span>
            <ImageInput
              label="Mask"
              partType="body"
              onLoad={(image) => {
                model()?.[`${key}Mask`].set(image);
              }}
              onRemove={() => {
                model()?.[`${key}Mask`].set(null);
              }}
              imageFilename={model()?.[`${key}Mask`].get()?.filename}
            />
          </>
          }
        </For>
        
      </EditorGuiGroup>
      <EditorGuiGroup parent>
          <span class="font-bold text-center mx-3">Spawnpoints</span>
      </EditorGuiGroup>
      <ModelSPGuiSection />
      <Button class="mx-3 mt-5" onClick={model()?.save}>
        Save
      </Button>
    </EditorGui>
  );
}


function ModelSPGuiSection() {
  const model = createMemo(() => useAcousticGuitarModel().get());
  return (
    <EditorGuiGroup>
      {/* <SPButton
        name="Fingerboard"
        partName="fingerboard"
        spSignal={model()?.spawnPoints.fingerboard}
      />
      <SPButton
        name="Fingerboard Back End"
        partName="fingerboardBackEnd"
        spSignal={model()?.spawnPoints.fingerboardBackEnd}
      /> */}
      <SPButton
          name="Bridge"
          partName="bridge"
          spSignal={model()?.spawnPoints.bridge}
        />
        {/* <SPButton
          name="Jack"
          partName="jack"
          spSignal={model()?.spawnPoints.jack}
        />
        <Show when={model()?.spawnPoints.jack.position.get()}>
          <Range
            value={model()?.spawnPoints.jack.rotation.get() ?? 0}
            onChange={(e) => model()?.spawnPoints.jack.rotation.set(e)}
            step={0.01}
            min={-Math.PI}
            max={Math.PI}
          />
        </Show> */}
    </EditorGuiGroup>
  );
}

function SPButton(props: {
  name: string;
  spSignal: SpawnPointType | undefined;
  partName : 'fingerboard' | 'fingerboardBackEnd' | 'bridge' | 'jack';
}) {
  const model = createMemo(() => useAcousticGuitarModel().get());
  return ( <></>
    // <ToggleableButtonWithState
    //   isActive={!!props.spSignal?.position.get()}
    //   isFocus={model()?.spawnPoints.selected.get() === props.partName}
    //   onReset={() => props.spSignal?.position.set()}
    //   onView={() => props.spSignal?.isShow.set((prev) => !prev)}
    //   viewActive={props.spSignal?.isShow.get()}
    //   onClick={() => {
    //     !props.spSignal?.position.get() &&
    //       props.spSignal?.position.set(Constants.defaultPos);
    //     model()?.spawnPoints.selected.set(props.partName);
    //   }}
    //   // onHover={() => {
    //   //   hoveredSP?.set(props.spEnum);
    //   // }}
    //   // onLeave={() => {
    //   //   hoveredSP?.set();
    //   // }}
    // >
    //   {props.name}
    // </ToggleableButtonWithState>
  );
}