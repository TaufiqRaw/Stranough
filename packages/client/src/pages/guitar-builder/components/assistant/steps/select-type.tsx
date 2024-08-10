import { useGuitarBuilderContext } from "~/pages/guitar-builder/guitar-builder";
import { GuitarTypeSelector } from "../../selectors/guitar-type-selector";
import { AssistantSelector } from "../utils/assistant-selector";

export function SelectType(){
  return <AssistantSelector
    title="Pilih jenis gitar"
    noRecommendation
    componentKey="guitarType"
    itemSelector={GuitarTypeSelector}
  />
}