import { GuitarBuilder } from "stranough-common";
import { ItemSelector } from "../utils/item-selector";
import { useGuitarBuilderContext } from "../../guitar-builder";
import { Show } from "solid-js";

const trussRodPositionThumbs : {[key in keyof typeof GuitarBuilder.trussRodPositions.electric] : string} = {
  "spoke-wheel" : "/assets/gui/truss-rod-position/spoke-wheel.png",
  "headstock" : "/assets/gui/truss-rod-position/headstock.png",
  "heel" : "/assets/gui/truss-rod-position/heel.png",
}

export const TrussRodPositionSelector = () => {
  const guitarBuilderCtx = useGuitarBuilderContext();
  //TODO :Show you must select a category first
return <Show when={guitarBuilderCtx?.getSelectedCategory()}>
  <ItemSelector
  items={()=>()=>GuitarBuilder.asArray(GuitarBuilder.trussRodPositions[guitarBuilderCtx!.getSelectedCategory()!]).map(i=>({
    ...i,
    thumbnailSrc : trussRodPositionThumbs[i.key]
  }))}
  onClick={async(i, o, ctx)=>{
      ctx?.getSelectedCategoryObj()?.trussRodPosition.set(i.key as any);
  }}
  selected={(i, ctx)=>{
    return i.key === ctx?.getSelectedCategoryObj()?.trussRodPosition.get();
  }}
  type="image"
/>
</Show>
}