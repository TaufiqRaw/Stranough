import { useParams } from "@solidjs/router";
import { NutEditorPresenter } from "./components/nut-editor-presenter";
import { NutEditorGui } from "./components/nut-editor-gui";
import { EditorPage } from "~/commons/components/editor-page";
import { createEntityResource } from "~/commons/functions/create-entity-resource";
import { createNut } from "./utils/create-nut";
import { nutRepository } from "./nut.repository";
import { createContext, useContext } from "solid-js";
import { NutContextType } from "./utils/types";

const NutContext = createContext<NutContextType>();

function NutEditor() {
  const params = useParams();
  const id = parseInt(params.id);

  const resource = createEntityResource(
    id,
    nutRepository.queryKey()[0],
    createNut,
    nutRepository.get,
    {
      onUpdate: nutRepository.update,
      onStore: nutRepository.create,
    }
  );

  return (
    <NutContext.Provider value={resource}>
      <EditorPage
        editorGui={() => <NutEditorGui />}
        presenter={() => <NutEditorPresenter />}
      />
    </NutContext.Provider>
  );
}

export function useGuitarNut() {
  return useContext(NutContext)!;
}

export default NutEditor;
