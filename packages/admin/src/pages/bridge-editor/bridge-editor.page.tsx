import { useParams } from "@solidjs/router";
import { BridgeEditorPresenter } from "./components/bridge-editor-presenter";
import { BridgeEditorGui } from "./components/bridge-editor-gui";
import { EditorPage } from "~/commons/components/editor-page";
import { createEntityResource } from "~/commons/functions/create-entity-resource";
import { createBridge } from "./utils/create-bridge";
import { bridgeRepository } from "./bridge.repository";
import { createContext, useContext } from "solid-js";
import { BridgeContextType } from "./utils/types";

const BridgeContext = createContext<BridgeContextType>();

function BridgeEditor() {
  const params = useParams();
  const id = parseInt(params.id);

  const resource = createEntityResource(
    id,
    "bridge",
    createBridge,
    bridgeRepository.get,
    {
      onUpdate: bridgeRepository.update,
      onStore: bridgeRepository.create,
    }
  );

  return (
    <BridgeContext.Provider value={resource}>
      <EditorPage
        editorGui={() => <BridgeEditorGui />}
        presenter={() => <BridgeEditorPresenter />}
      />
    </BridgeContext.Provider>
  );
}

export function useGuitarBridge() {
  return useContext(BridgeContext)!;
}

export default BridgeEditor;
