import { useParams } from "@solidjs/router";
import { PickupEditorPresenter } from "./components/pickup-editor-presenter";
import { PickupEditorGui } from "./components/pickup-editor-gui";
import { EditorPage } from "~/commons/components/editor-page";
import { createEntityResource } from "~/commons/functions/create-entity-resource";
import { createPickup } from "./utils/create-pickup";
import { pickupRepository } from "./pickup.repository";
import { createContext, useContext } from "solid-js";
import { PickupContextType } from "./utils/types";

const PickupContext = createContext<PickupContextType>();

function PickupEditor() {
  const params = useParams();
  const id = parseInt(params.id);

  const resource = createEntityResource(
    id,
    pickupRepository.queryKey()[0],
    createPickup,
    pickupRepository.get,
    {
      onUpdate: pickupRepository.update,
      onStore: pickupRepository.create,
    }
  );

  return (
    <PickupContext.Provider value={resource}>
      <EditorPage
        editorGui={() => <PickupEditorGui />}
        presenter={() => <PickupEditorPresenter />}
      />
    </PickupContext.Provider>
  );
}

export function useGuitarPickup() {
  return useContext(PickupContext)!;
}

export default PickupEditor;
