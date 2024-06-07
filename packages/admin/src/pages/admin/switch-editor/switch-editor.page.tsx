import { useParams } from "@solidjs/router";
import { SwitchEditorPresenter } from "./components/switch-editor-presenter";
import { EditorPage } from "~/commons/components/editor-page";
import { createEntityResource } from "~/commons/functions/create-entity-resource";
import { createSwitch } from "./utils/create-switch";
import { switchRepository } from "./switch.repository";
import { createContext, useContext } from "solid-js";
import { SwitchContextType } from "./utils/types";
import { SwitchEditorGui } from "./components/switch-editor-gui";

const SwitchContext = createContext<SwitchContextType>();

function SwitchEditor() {
  const params = useParams();
  const id = parseInt(params.id);

  const resource = createEntityResource(
    id,
    switchRepository.queryKey()[0],
    createSwitch,
    switchRepository.get,
    {
      onUpdate: switchRepository.update,
      onStore: switchRepository.create,
    }
  );

  return (
    <SwitchContext.Provider value={resource}>
      <EditorPage
        editorGui={() => <SwitchEditorGui />}
        presenter={() => <SwitchEditorPresenter />}
      />
    </SwitchContext.Provider>
  );
}

export function useGuitarSwitch() {
  return useContext(SwitchContext)!;
}

export default SwitchEditor;
