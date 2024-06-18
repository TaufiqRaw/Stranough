import { useParams } from "@solidjs/router";
import { AcousticModelEditorPresenter } from "./components/acoustic-model-editor-presenter";
import { AcousticModelEditorGui } from "./components/acoustic-model-editor-gui";
import { EditorPage } from "~/commons/components/editor-page";
import { createEntityResource } from "~/commons/functions/create-entity-resource";
import { createAcousticGuitarModel } from "./utils/create-acoustic-guitar-model";
import { acousticGuitarModelRepository } from "./acoustic-guitar-model.repository";
import { createContext, useContext } from "solid-js";
import { AcousticGuitarModelContextType } from "./utils/types";

const AcousticGuitarModelContext = createContext<AcousticGuitarModelContextType>();

export function AcousticGuitarModelEditor() {
  const params = useParams();
  const id = parseInt(params.id);

  const resource = createEntityResource(
    id,
    acousticGuitarModelRepository.queryKey()[0],
    createAcousticGuitarModel,
    acousticGuitarModelRepository.get,
    {
      onUpdate: acousticGuitarModelRepository.update,
      onStore: acousticGuitarModelRepository.create,
    }
  );

  return (
    <AcousticGuitarModelContext.Provider value={resource}>
      <EditorPage
        editorGui={() => <AcousticModelEditorGui />}
        presenter={() => <AcousticModelEditorPresenter />}
      />
    </AcousticGuitarModelContext.Provider>
  );
}

export function useAcousticGuitarModel() {
  return useContext(AcousticGuitarModelContext)!;
}

export default AcousticGuitarModelEditor;
