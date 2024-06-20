import { useParams } from "@solidjs/router";
import { PegEditorPresenter } from "./components/peg-editor-presenter";
import { PegEditorGui } from "./components/peg-editor-gui";
import { EditorPage } from "~/commons/components/editor-page";
import { createEntityResource } from "~/commons/functions/create-entity-resource";
import { createPeg } from "./utils/create-peg";
import { pegRepository } from "./peg.repository";
import { createContext, useContext } from "solid-js";
import { PegContextType } from "./utils/types";

const PegContext = createContext<PegContextType>();

function PegEditor() {
  const params = useParams();
  const id = parseInt(params.id);

  const resource = createEntityResource(
    id,
    pegRepository.queryKey()[0],
    createPeg,
    pegRepository.get,
    {
      onUpdate: pegRepository.update,
      onStore: pegRepository.create,
    }
  );

  return (
    <PegContext.Provider value={resource}>
      <EditorPage
        editorGui={() => <PegEditorGui />}
        presenter={() => <PegEditorPresenter />}
      />
    </PegContext.Provider>
  );
}

export function useGuitarPeg() {
  return useContext(PegContext)!;
}

export default PegEditor;
