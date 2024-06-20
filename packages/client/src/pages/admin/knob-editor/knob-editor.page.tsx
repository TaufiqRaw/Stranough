import { useParams } from "@solidjs/router";
import { KnobEditorPresenter } from "./components/knob-editor-presenter";
import { KnobEditorGui } from "./components/knob-editor-gui";
import { EditorPage } from "~/commons/components/editor-page";
import { createEntityResource } from "~/commons/functions/create-entity-resource";
import { createKnob } from "./utils/create-knob";
import { knobRepository } from "./knob.repository";
import { createContext, useContext } from "solid-js";
import { KnobContextType } from "./utils/types";

const KnobContext = createContext<KnobContextType>();

function KnobEditor() {
  const params = useParams();
  const id = parseInt(params.id);

  const resource = createEntityResource(
    id,
    knobRepository.queryKey()[0],
    createKnob,
    knobRepository.get,
    {
      onUpdate: knobRepository.update,
      onStore: knobRepository.create,
    }
  );

  return (
    <KnobContext.Provider value={resource}>
      <EditorPage
        editorGui={() => <KnobEditorGui />}
        presenter={() => <KnobEditorPresenter />}
      />
    </KnobContext.Provider>
  );
}

export function useGuitarKnob() {
  return useContext(KnobContext)!;
}

export default KnobEditor;
