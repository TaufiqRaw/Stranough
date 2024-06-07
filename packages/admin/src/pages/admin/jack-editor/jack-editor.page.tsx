import { useParams } from "@solidjs/router";
import { JackEditorPresenter } from "./components/jack-editor-presenter";
import { JackEditorGui } from "./components/jack-editor-gui";
import { EditorPage } from "~/commons/components/editor-page";
import { createEntityResource } from "~/commons/functions/create-entity-resource";
import { createJack } from "./utils/create-jack";
import { jackRepository } from "./jack.repository";
import { createContext, useContext } from "solid-js";
import { JackContextType } from "./utils/types";

const JackContext = createContext<JackContextType>();

function JackEditor() {
  const params = useParams();
  const id = parseInt(params.id);

  const resource = createEntityResource(
    id,
    jackRepository.queryKey()[0],
    createJack,
    jackRepository.get,
    {
      onUpdate: jackRepository.update,
      onStore: jackRepository.create,
    }
  );

  return (
    <JackContext.Provider value={resource}>
      <EditorPage
        editorGui={() => <JackEditorGui />}
        presenter={() => <JackEditorPresenter />}
      />
    </JackContext.Provider>
  );
}

export function useGuitarJack() {
  return useContext(JackContext)!;
}

export default JackEditor;
