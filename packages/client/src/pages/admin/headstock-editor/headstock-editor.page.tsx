import { useParams } from "@solidjs/router";
import { HeadstockEditorPresenter } from "./components/headstock-editor-presenter";
import { HeadstockEditorGui } from "./components/headstock-editor-gui";
import { EditorPage } from "~/commons/components/editor-page";
import { createEntityResource } from "~/commons/functions/create-entity-resource";
import { createHeadstock } from "./utils/create-headstock";
import { headstockRepository } from "./headstock.repository";
import { createContext, useContext } from "solid-js";
import { HeadstockContextType } from "./utils/types";

const HeadstockContext = createContext<HeadstockContextType>();

function HeadstockEditor() {
  const params = useParams();
  const id = parseInt(params.id);

  const resource = createEntityResource(
    id,
    headstockRepository.queryKey()[0],
    createHeadstock,
    headstockRepository.get,
    {
      onUpdate: headstockRepository.update,
      onStore: headstockRepository.create,
    }
  );

  return (
    <HeadstockContext.Provider value={resource}>
      <EditorPage
        editorGui={() => <HeadstockEditorGui />}
        presenter={() => <HeadstockEditorPresenter />}
      />
    </HeadstockContext.Provider>
  );
}

export function useGuitarHeadstock() {
  return useContext(HeadstockContext)!;
}

export default HeadstockEditor;
