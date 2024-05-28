import { useParams } from "@solidjs/router";
import ModelEditorGui from "./components/model-editor-gui";
import { EditorPage } from "~/commons/components/editor-page";
import { createEntityResource } from "~/commons/functions/create-entity-resource";
import { createModel } from "./utils/functions/create-model";
import { guitarModelRepository } from "./guitar-model.repository";
import { GuitarModelContextType } from "./utils/types";
import { createContext, useContext } from "solid-js";
import { ModelEditorPresenter } from "./components/model-editor-presenter";

const GuitarModelContext = createContext<GuitarModelContextType>();
export default function ModelEditor() {
  const params = useParams();
  const id = parseInt(params.id);

  const resource = createEntityResource(id, 
    'guitar-model',
    createModel,
    guitarModelRepository.get,
    {
      onUpdate : guitarModelRepository.update,
      onStore : guitarModelRepository.create,
    }
  )

  return <GuitarModelContext.Provider value={resource}>
    <EditorPage
      editorGui={() => <ModelEditorGui />}
      presenter={() => <ModelEditorPresenter />}
    />
  </GuitarModelContext.Provider>
}

export function useGuitarModel(){
  return useContext(GuitarModelContext)!;
}