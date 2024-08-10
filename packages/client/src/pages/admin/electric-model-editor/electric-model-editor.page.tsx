import { useParams } from "@solidjs/router";
import ElectricModelEditorGui from "./components/electric-model-editor-gui";
import { EditorPage } from "~/commons/components/editor-page";
import { createEntityResource } from "~/commons/functions/create-entity-resource";
import { createModel } from "./utils/functions/create-electric-model";
import { electricModelRepository } from "./electric-model.repository";
import { GuitarModelContextType } from "./utils/types";
import { createContext, getOwner, useContext } from "solid-js";
import { ElectricModelEditorPresenter } from "./components/electric-model-editor-presenter";

const ElectricModelContext = createContext<GuitarModelContextType>();
export default function ModelEditor() {
  const params = useParams();
  const id = parseInt(params.id);

  const resource = createEntityResource(id, 
    'guitar-model',
    createModel,
    (data, options)=>electricModelRepository.get(data, {
      onSave : options.onSave,
      owner : getOwner()!,
    }),
    {
      onUpdate : electricModelRepository.update,
      onStore : electricModelRepository.create,
    }
  )

  return <ElectricModelContext.Provider value={resource}>
    <EditorPage
      editorGui={() => <ElectricModelEditorGui />}
      presenter={() => <ElectricModelEditorPresenter />}
    />
  </ElectricModelContext.Provider>
}

export function useElectricModel(){
  return useContext(ElectricModelContext)!;
}