import { useParams } from "@solidjs/router";
import { JackEditorPresenter } from "./components/pickguard-editor-presenter";
import { PickguardEditorGui } from "./components/pickguard-editor-gui";
import { EditorPage } from "~/commons/components/editor-page";
import { createEntityResource } from "~/commons/functions/create-entity-resource";
import { createPickguard } from "./utils/create-pickguard";
import { pickguardRepository } from "./pickguard.repository";
import { createContext, useContext } from "solid-js";
import { PickguardContextType } from "./utils/types";

const PickguardContext = createContext<PickguardContextType>();

function PickguardEditor() {
  const params = useParams();
  const id = parseInt(params.id);

  const resource = createEntityResource(
    id,
    pickguardRepository.queryKey()[0],
    createPickguard,
    pickguardRepository.get,
    {
      onUpdate: pickguardRepository.update,
      onStore: pickguardRepository.create,
    }
  );

  return (
    <PickguardContext.Provider value={resource}>
      <EditorPage
        editorGui={() => <PickguardEditorGui />}
        presenter={() => <JackEditorPresenter />}
      />
    </PickguardContext.Provider>
  );
}

export function useGuitarPickguard() {
  return useContext(PickguardContext)!;
}

export default PickguardEditor;
